const Graph = ({ title = 'Graph', className = '' }) => {
  return (
    <div className={`${className} flex flex-col`}>
      <div className='text-xl text-center'>{title}</div>
      <div className='border-l-2 border-b-2 flex-1'></div>
    </div>
  )
}

export default Graph
