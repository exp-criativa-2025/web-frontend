import users from '@/app/lib/placeholder-data';

export default function UsersPage() {  
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-black">Usuários registrados no Sistema</h1>
      <table className="[&_tr]:border-b sticky top-0 z-10">
        <thead>
          <tr className='hover:bg-muted/50 border-b'>
            {Object.keys(users[0]).map((key) => (
              <th key={key} className="border border-gray-300 px-4 py-2">
            {key.charAt(0).toUpperCase() + key.slice(1)}
              </th>
            ))}
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              {Object.values(user).map((value, index) => (
            <td
              key={index}
              className="border border-gray-300 px-4 py-2 md:text-sm lg:text-base text-xs"
            >
              {value}
            </td>
              ))}
              <td className="flex border border-gray-200 px-4 py-2 md:text-sm text-xs justify-center">
            <a href={`user/${user.id}`}>
              <button className="bg-[var(--paleta3)] p-2 rounded-[10] m-2">
                Alterar
              </button>
            </a>
            <button className="bg-[#ff4040] p-2 rounded-[10] m-2">
              Delete
            </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}