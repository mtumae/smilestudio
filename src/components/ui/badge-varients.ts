const badgeVariants = {
    status: {
      awaiting: "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200",
      upcoming: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
      completed: "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200",
      cancelled: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200",
    },
    priority: {
      low: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200",
      high: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200",
    },
    default: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200",
  };
  
  export { badgeVariants };