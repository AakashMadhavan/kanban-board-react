import { useEffect, useRef, useState } from 'react';
import { useBoard } from '../context/BoardContext.jsx';

function EditTaskModal({ task, onClose }) {
  const { editTask } = useBoard();
  const [content, setContent] = useState(task.content);
  const textareaRef = useRef(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    editTask(task.id, content);
    onClose();
  }

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={handleBackdropClick}
    >
      <form
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`edit-${task.id}`}
        onSubmit={handleSubmit}
      >
        <h2 id={`edit-${task.id}`}>Edit task</h2>
        <textarea
          ref={textareaRef}
          aria-label="Task content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows={5}
        />
        <div className="modal-actions">
          <button className="button button-ghost" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="button button-primary" type="submit">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditTaskModal;
