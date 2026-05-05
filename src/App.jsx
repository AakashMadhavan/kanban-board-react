import Board from './components/Board.jsx';
import { BoardProvider } from './context/BoardContext.jsx';

function App() {
  return (
    <BoardProvider>
      <main className="app-shell">
        <header className="app-header">
          <div>
            <p className="eyebrow">Workspace</p>
            <h1>Kanban Board</h1>
          </div>
        </header>
        <Board />
      </main>
    </BoardProvider>
  );
}

export default App;
