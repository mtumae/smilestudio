import { StartConversationDialog } from '~/components/StartConversation'

export function ContactHero() {
  return (
    <div className="bg-ssblue text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Get in Touch
        </h1>
        <p className="mt-6 text-xl max-w-3xl mx-auto">
          We&apos;re here to help. Start a conversation with our team or explore other ways to connect.
        </p>
        <div className="mt-10">
          <StartConversationDialog />
        </div>
      </div>
    </div>
  )
}
