import { Droppable } from '@hello-pangea/dnd';
import AddTask from './AddTask.jsx';
import TaskCard from './TaskCard.jsx';

function Column({ column, tasks }) {
  return (
    <article className="column">
      <div className="column-header">
        <h2>{column.title}</h2>
        <span className="task-count">{tasks.length}</span>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            className={`task-list ${snapshot.isDraggingOver ? 'task-list-over' : ''}`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                columnId={column.id}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <AddTask columnId={column.id} />
    </article>
  );
}

export default Column;
