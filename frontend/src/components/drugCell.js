const DrugCell = ({ data, onDrugClick }) => {
  const regex =
    /rgb(?:a)?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})(?:,\s*(\d(?:\.\d+)?))?\)/
  const c = data.model[0].match(regex)
  const borderCol =
    'rgb(' + (c[1] - 30) + ', ' + (c[2] - 30) + ', ' + (c[3] - 20) + ')'
  return (
    <div
      className={`hover:scale-105 active:scale-90 duration-75 flex justify-center items-center w-full rounded-full h-10 shadow-2xl border-b-3`}
      style={{ backgroundColor: data.model[0], borderBottomColor: borderCol }}
      onClick={() => onDrugClick(data)}
    >
      {data.name}
    </div>
  )
}

export default DrugCell
