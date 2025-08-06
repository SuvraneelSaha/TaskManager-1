function Dashboard() {
  // Dummy data to simulate task list
  const tasks = [
    { id: 1, title: "Finish project", dueDate: "2025-08-10", completed: true },
    { id: 2, title: "Buy groceries", dueDate: "2025-08-07", completed: false },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Your Tasks</h2>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border">#</th>
            <th className="px-4 py-2 border">Task Name</th>
            <th className="px-4 py-2 border">Due Date</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr key={task.id} className="text-center">
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{task.title}</td>
              <td className="border px-4 py-2">{task.dueDate}</td>
              <td className="border px-4 py-2">
                <button className={`px-2 py-1 rounded ${task.completed ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                  {task.completed ? "Complete" : "Incomplete"}
                </button>
              </td>
              <td className="border px-4 py-2 space-x-2">
                <button className="text-yellow-500 hover:text-yellow-700">✏️</button>
                <button className="text-red-500 hover:text-red-700">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;