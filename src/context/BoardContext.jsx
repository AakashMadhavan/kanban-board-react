import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { initialData } from '../data/initialData.js';

const STORAGE_KEY = 'kanban-board-state';
const BoardContext = createContext(null);

function createTaskId() {
  return `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function loadBoardState() {
  try {
    const storedState = localStorage.getItem(STORAGE_KEY);
    return storedState ? JSON.parse(storedState) : initialData;
  } catch {
    return initialData;
  }
}

export function BoardProvider({ children }) {
  const [boardData, setBoardData] = useState(loadBoardState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(boardData));
  }, [boardData]);

  const addTask = useCallback((columnId, content) => {
    const trimmedContent = content.trim();

    if (!trimmedContent) {
      return;
    }

    setBoardData((currentData) => {
      const taskId = createTaskId();
      const targetColumn = currentData.columns[columnId];

      return {
        ...currentData,
        tasks: {
          ...currentData.tasks,
          [taskId]: { id: taskId, content: trimmedContent },
        },
        columns: {
          ...currentData.columns,
          [columnId]: {
            ...targetColumn,
            taskIds: [...targetColumn.taskIds, taskId],
          },
        },
      };
    });
  }, []);

  const deleteTask = useCallback((taskId, columnId) => {
    setBoardData((currentData) => {
      const { [taskId]: removedTask, ...remainingTasks } = currentData.tasks;
      const targetColumn = currentData.columns[columnId];

      return {
        ...currentData,
        tasks: remainingTasks,
        columns: {
          ...currentData.columns,
          [columnId]: {
            ...targetColumn,
            taskIds: targetColumn.taskIds.filter((id) => id !== taskId),
          },
        },
      };
    });
  }, []);

  const editTask = useCallback((taskId, newContent) => {
    const trimmedContent = newContent.trim();

    if (!trimmedContent) {
      return;
    }

    setBoardData((currentData) => ({
      ...currentData,
      tasks: {
        ...currentData.tasks,
        [taskId]: {
          ...currentData.tasks[taskId],
          content: trimmedContent,
        },
      },
    }));
  }, []);

  const moveTask = useCallback((source, destination) => {
    setBoardData((currentData) => {
      const sourceColumn = currentData.columns[source.droppableId];
      const destinationColumn = currentData.columns[destination.droppableId];
      const sourceTaskIds = Array.from(sourceColumn.taskIds);
      const [movedTaskId] = sourceTaskIds.splice(source.index, 1);

      if (sourceColumn.id === destinationColumn.id) {
        sourceTaskIds.splice(destination.index, 0, movedTaskId);

        return {
          ...currentData,
          columns: {
            ...currentData.columns,
            [sourceColumn.id]: {
              ...sourceColumn,
              taskIds: sourceTaskIds,
            },
          },
        };
      }

      const destinationTaskIds = Array.from(destinationColumn.taskIds);
      destinationTaskIds.splice(destination.index, 0, movedTaskId);

      return {
        ...currentData,
        columns: {
          ...currentData.columns,
          [sourceColumn.id]: {
            ...sourceColumn,
            taskIds: sourceTaskIds,
          },
          [destinationColumn.id]: {
            ...destinationColumn,
            taskIds: destinationTaskIds,
          },
        },
      };
    });
  }, []);

  const value = useMemo(
    () => ({
      boardData,
      addTask,
      deleteTask,
      editTask,
      moveTask,
    }),
    [addTask, boardData, deleteTask, editTask, moveTask],
  );

  return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>;
}

export function useBoard() {
  const context = useContext(BoardContext);

  if (!context) {
    throw new Error('useBoard must be used within a BoardProvider');
  }

  return context;
}
