import { useEffect, useState, type FormEvent } from 'react'

type Task = { id: string; title: string; done: boolean }

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`/api${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  })
  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as { error?: string }
    throw new Error(body.error || 'Não foi possível completar a operação.')
  }
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    request<Task[]>('/tasks')
      .then(data => { if (!cancelled) setTasks(data) })
      .catch(err => { if (!cancelled) setError((err as Error).message) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  async function addTask(e: FormEvent) {
    e.preventDefault()
    if (!title.trim() || busy) return
    setError('')
    setBusy(true)
    try {
      const task = await request<Task>('/tasks', {
        method: 'POST', body: JSON.stringify({ title: title.trim() }),
      })
      setTasks(previous => [task, ...previous])
      setTitle('')
    } catch (err) { setError((err as Error).message) }
    finally { setBusy(false) }
  }

  async function toggleTask(task: Task) {
    if (busy) return
    setError('')
    setBusy(true)
    try {
      const updated = await request<Task>(`/tasks/${task.id}`, {
        method: 'PATCH', body: JSON.stringify({ done: !task.done }),
      })
      setTasks(previous => previous.map(item => item.id === updated.id ? updated : item))
    } catch (err) { setError((err as Error).message) }
    finally { setBusy(false) }
  }

  async function removeTask(task: Task) {
    if (busy) return
    setError('')
    setBusy(true)
    try {
      await request<void>(`/tasks/${task.id}`, { method: 'DELETE' })
      setTasks(previous => previous.filter(item => item.id !== task.id))
    } catch (err) { setError((err as Error).message) }
    finally { setBusy(false) }
  }

  const done = tasks.filter(task => task.done).length

  return (
    <main className="page">
      <header className="header">
        <div className="brandmark">E</div>
        <div>
          <div className="brand">EduFlow <span>• Iniciante</span></div>
          <p className="tagline">Um projeto pequeno para aprender Full Stack.</p>
        </div>
      </header>

      <section className="content" aria-labelledby="heading">
        <p className="eyebrow">MEUS ESTUDOS</p>
        <h1 id="heading">Organize suas tarefas.</h1>
        <p className="intro">Uma lista simples conectada a um banco PostgreSQL.</p>

        <form className="form" onSubmit={addTask}>
          <label htmlFor="title">Nova tarefa</label>
          <div className="formrow">
            <input
              id="title" value={title} maxLength={120}
              onChange={event => setTitle(event.target.value)}
              placeholder="Ex.: estudar banco de dados"
              autoComplete="off"
              disabled={busy}
            />
            <button type="submit" disabled={!title.trim() || busy}>Adicionar</button>
          </div>
        </form>

        <div className="listHeader">
          <h2>Tarefas</h2>
          <span className="counter">{done} de {tasks.length} concluídas</span>
        </div>
        {error && <div className="error" role="alert">{error}</div>}
        {loading ? <p className="empty">Carregando tarefas...</p> : tasks.length === 0 ? (
          <div className="empty">Você ainda não cadastrou tarefas. Comece pela primeira!</div>
        ) : (
          <ul className="list">
            {tasks.map(task => (
              <li className="task" key={task.id}>
                <label className="tasklabel">
                  <input type="checkbox" checked={task.done} disabled={busy}
                    onChange={() => toggleTask(task)} />
                  <span className={task.done ? 'completed' : ''}>{task.title}</span>
                </label>
                <button className="delete" type="button" disabled={busy}
                  onClick={() => removeTask(task)} aria-label={`Excluir ${task.title}`}>Excluir</button>
              </li>
            ))}
          </ul>
        )}
      </section>
      <footer>React + Node.js + PostgreSQL · Versão de aprendizado local</footer>
    </main>
  )
}
