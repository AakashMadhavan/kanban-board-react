import { useState } from 'react';
import { useBoard } from '../context/BoardContext.jsx';

function AddTask({ columnId }) {
  const { addTask } = useBoard();
  const [content, setContent] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    addTask(columnId, content);
    setContent('');
  }

  return (
    <form className="add-task" onSubmit={handleSubmit}>
      <textarea
        aria-label="New task content"
        placeholder="Add a task..."
        value={content}
        onChange={(event) => setContent(event.target.value)}
        rows={3}
      />
      <button className="button button-primary" type="submit">
        Add Task
      </button>
    </form>
  );
}

export default AddTask;
