import { Phone, Mail, MapPin } from "lucide-react"

const contactMethods = [
  { icon: Phone, title: "Phone", description: "+1 (555) 123-4567", action: "Call now" },
  { icon: Mail, title: "Email", description: "support@example.com", action: "Send email" },
  { icon: MapPin, title: "Office", description: "123 Main St, City, State 12345", action: "Get directions" },
]

export function ContactOptions() {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-12">
      {contactMethods.map((method) => (
        <div
          key={method.title}
          className="bg-white rounded-lg shadow-md p-6 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-ssblue rounded-full mb-4">
            <method.icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold mb-2">{method.title}</h3>
          <p className="text-gray-600 mb-4">{method.description}</p>
          <button className="text-ssblue hover:text-ssblue/80 font-medium transition-colors duration-200">
            {method.action}
          </button>
        </div>
      ))}
    </div>
  )
}

