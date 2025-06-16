import users from '@/app/lib/placeholder-data';

export default function UserPage({params}: {params: {id: string}}) {

    const user = users.find((user) => user.id === Number(params.id));

    if (!user) {
        return <div className='flex flex-col w-full h-[60vh] p-10 items-center justify-center font-bold text-3xl'>Usuário não encontrado
        <a href={`../user`}><button className='m-5 bg-[var(--paleta3)] p-3 rounded-3xl'>Voltar</button></a></div>;
    }


  return (
    <>
      <div className='flex w-full h-[60vh] p-10 items-center justify-center'>
        <form className='flex flex-col gap-4 w-[70vw] bg-[#edf2e1] p-10 rounded-lg shadow-lg'>
          <h1 className='text-3xl font-bold mb-6 text-black'>Alteração de usuário</h1>
          {Object.entries(user).map(([key, value]) => (
        key !== 'id' && (
          <div key={key} className='flex flex-col'>
            <label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
            <input
          type={typeof value === 'number' ? 'number' : 'text'}
          id={key}
          name={key}
          defaultValue={value}
          className='border-2 border-gray-300 rounded-lg p-2'
            />
          </div>
        )
          ))}
          <button type="submit" className='bg-green-500 text-white p-2 rounded-lg'>Salvar</button>
          <a href={`../user`} className='w-full'><button type="submit" className='w-full bg-red-400 text-white p-2 rounded-lg'>Voltar</button></a>
        </form>
      </div>
    </>
  );
}