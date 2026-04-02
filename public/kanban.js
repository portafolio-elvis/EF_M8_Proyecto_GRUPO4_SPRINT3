'use strict';

// afterMove runs synchronously inside the transition callback,
// guaranteeing the count update sees the already-moved card.
function moveCardToColumn(card, targetCol, afterMove) {
  const doMove = () => {
    targetCol.appendChild(card);
    if (afterMove) afterMove();
  };

  if ('startViewTransition' in document) {
    document.startViewTransition(doMove);
  } else {
    doMove();
  }
}

function updateCount(listEl) {
  const badge = listEl.querySelector('.kanban-list-count');
  if (badge) badge.textContent = listEl.querySelectorAll('.kanban-card').length;
}

function persistMove(cardId, fromBoardId, fromListId, toBoardId, toListId) {
  fetch(`/api/listas/${toListId}/tarjetas/${cardId}/move`, {
    method:  'PUT',
    headers: { 'Content-Type': 'application/json' }
  })
    .then(r => r.json())
    .then(data => { if (data.ok === false) location.reload(); })
    .catch(() => location.reload());
}

// ── Interceptor AJAX Global para Formularios ──────────────
document.addEventListener('submit', async (e) => {
  const form = e.target.closest('form[data-ajax-form]');
  if (!form) return;
  e.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch(form.action, {
      method: form.getAttribute('method') || 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();

    if (response.ok && result.ok !== false) {
      if (form.action.includes('/auth/login')) {
        window.location.href = '/dashboard';
      } else if (form.action.includes('/auth/register')) {
        window.location.href = '/login';
      } else {
        // Soft reload del panel Kanban
        const htmlResp = await fetch('/dashboard');
        const htmlText = await htmlResp.text();
        const doc = new DOMParser().parseFromString(htmlText, 'text/html');
        
        const boardContainer = document.querySelector('.kanban-board');
        if (boardContainer) {
          const newBoard = doc.querySelector('.kanban-board');
          if (newBoard) boardContainer.innerHTML = newBoard.innerHTML;
          
          if (typeof initGSAPDrag !== 'undefined') initGSAPDrag();
          document.querySelectorAll('[popover]').forEach(p => {
            if (p.hidePopover) p.hidePopover();
          });
        } else {
          window.location.reload();
        }
      }
    } else {
      alert("Error: " + (result.error || 'Operación fallida'));
    }
  } catch (err) {
    console.error(err);
    alert("Error de comunicación de red al procesar el formulario.");
  }
});

// ── GSAP Draggable ───────────────────────────────────
function initGSAPDrag() {
  gsap.registerPlugin(Draggable);

  const dropZones = Array.from(document.querySelectorAll('.kanban-cards'));

  document.querySelectorAll('.kanban-card').forEach(card => {
    const handle = card.querySelector('.kanban-drag-handle');
    if (!handle) return;

    let fromListId, fromBoardId, fromListEl;
    let activeZone = null;

    Draggable.create(card, {
      type:    'x,y',
      trigger: handle,
      zIndex:  1000,

      onDragStart() {
        fromListId  = card.dataset.listId;
        fromBoardId = card.dataset.boardId;
        fromListEl  = card.closest('.kanban-list');
        card.classList.add('dragging');
      },

      onDrag() {
        let found = null;
        for (const zone of dropZones) {
          if (this.hitTest(zone, '30%')) { found = zone; break; }
        }
        if (found !== activeZone) {
          if (activeZone) activeZone.classList.remove('drag-over');
          if (found)      found.classList.add('drag-over');
          activeZone = found;
        }
      },

      onDragEnd() {
        card.classList.remove('dragging');
        if (activeZone) activeZone.classList.remove('drag-over');

        const toZone = activeZone;
        activeZone = null;

        if (!toZone) {
          gsap.set(card, { x: 0, y: 0 });
          return;
        }

        const toListId  = toZone.dataset.listId;
        const toBoardId = toZone.dataset.boardId;

        if (toListId === fromListId && toBoardId === fromBoardId) {
          gsap.set(card, { x: 0, y: 0 });
          return;
        }

        const cardId   = card.dataset.cardId;
        const toListEl = toZone.closest('.kanban-list');

        // Reset GSAP transform before DOM move so view transition captures clean state
        gsap.set(card, { x: 0, y: 0, zIndex: '' });

        moveCardToColumn(card, toZone, () => {
          card.dataset.listId  = toListId;
          card.dataset.boardId = toBoardId;
          updateCount(fromListEl);
          updateCount(toListEl);
        });

        persistMove(cardId, fromBoardId, fromListId, toBoardId, toListId);
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (typeof Draggable === 'undefined') {
    console.error('GSAP Draggable not loaded.');
    return;
  }
  initGSAPDrag();
});
