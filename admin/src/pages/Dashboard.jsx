export default function Dashboard() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Dashboard Overview</h2>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow">
          <h3 className="font-semibold mb-2">Total Pandals</h3>
          <p className="text-3xl font-bold">23</p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow">
          <h3 className="font-semibold mb-2">Themes</h3>
          <p className="text-3xl font-bold">12</p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow">
          <h3 className="font-semibold mb-2">Artists</h3>
          <p className="text-3xl font-bold">8</p>
        </div>
      </div>
    </div>
  );
}
