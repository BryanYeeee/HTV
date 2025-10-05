import { motion } from "motion/react"
const DrugCell = ({ data, onDrugClick }) => {
  const regex =
    /rgb(?:a)?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})(?:,\s*(\d(?:\.\d+)?))?\)/
  const c = data.properties[1].match(regex)
  const borderCol =
    'rgb(' + (c[1] - 30) + ', ' + (c[2] - 30) + ', ' + (c[3] - 20) + ')'
  return (
    <motion.div
      initial={{ scale: 0 }}  
      animate={{ scale: 1 }}          
      transition={{ duration: 0.3 }}
      className={`relative px-8 py-4 hover:scale-105 active:scale-90 duration-75 flex justify-center items-center rounded-full h-6 shadow-2xl border-b-3`}
      style={{ backgroundColor: data.properties[1], borderBottomColor: borderCol }}
      onClick={() => onDrugClick(data)}
    >
      <span className="absolute whitespace-nowrap">{data.drugname}</span>
    </motion.div>
  )
}

export default DrugCell
