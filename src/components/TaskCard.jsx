import { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { useBoard } from '../context/BoardContext.jsx';
import EditTaskModal from './EditTaskModal.jsx';

function TaskCard({ task, index, columnId }) {
  const { deleteTask } = useBoard();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <Draggable draggableId={task.id} index={index}>
        {(provided, snapshot) => (
          <div
            className={`task-card ${snapshot.isDragging ? 'task-card-dragging' : ''}`}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <p>{task.content}</p>
            <div className="task-actions">
              <button
                className="button button-ghost"
                type="button"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
              <button
                className="button button-danger"
                type="button"
                onClick={() => deleteTask(task.id, columnId)}
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </Draggable>

      {isEditing && (
        <EditTaskModal task={task} onClose={() => setIsEditing(false)} />
      )}
    </>
  );
}

export default TaskCard;
