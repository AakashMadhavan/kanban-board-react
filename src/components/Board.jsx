import { DragDropContext } from '@hello-pangea/dnd';
import { useBoard } from '../context/BoardContext.jsx';
import Column from './Column.jsx';

function Board() {
  const { boardData, moveTask } = useBoard();

  function handleDragEnd(result) {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    const isSamePosition =
      destination.droppableId === source.droppableId &&
      destination.index === source.index;

    if (isSamePosition) {
      return;
    }

    moveTask(source, destination);
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <section className="board" aria-label="Kanban columns">
        {boardData.columnOrder.map((columnId) => {
          const column = boardData.columns[columnId];
          const tasks = column.taskIds.map((taskId) => boardData.tasks[taskId]);

          return <Column key={column.id} column={column} tasks={tasks} />;
        })}
      </section>
    </DragDropContext>
  );
}

export default Board;
