'use client'

import { Agent } from '@/lib/data'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Image from 'next/image'

interface AgentSwitcherProps {
  currentAgentId: string
  agents: Agent[]
  onAgentChange: (agentId: string) => void
  disabled?: boolean
}

export function AgentSwitcher({
  currentAgentId,
  agents,
  onAgentChange,
  disabled,
}: AgentSwitcherProps) {
  const currentAgent = agents.find((a) => a.id === currentAgentId)

  return (
    <Select
      value={currentAgentId}
      onValueChange={onAgentChange}
      disabled={disabled}
    >
      <SelectTrigger className="w-full glass border-blue-600/30 bg-gray-800/50">
        <SelectValue>
          <div className="flex items-center gap-2">
            {currentAgent?.logo && (
              <div className="relative w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={currentAgent.logo}
                  alt={currentAgent.name}
                  fill
                  className="object-contain p-0.5"
                  sizes="20px"
                />
              </div>
            )}
            <span>{currentAgent?.name || currentAgentId}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="glass border-blue-600/30 bg-gray-900/95 backdrop-blur-xl">
        {agents.map((agent) => (
          <SelectItem key={agent.id} value={agent.id}>
            <div className="flex items-center gap-2">
              {agent.logo && (
                <div className="relative w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={agent.logo}
                    alt={agent.name}
                    fill
                    className="object-contain p-0.5"
                    sizes="20px"
                  />
                </div>
              )}
              <span>{agent.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

