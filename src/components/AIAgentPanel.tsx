"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Code2, Sparkles, Send, Copy, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type AgentType = {
  id: string;
  name: string;
  language: string;
  expertise: string[];
  color: string;
  icon: string;
};

type Message = {
  id: string;
  role: "user" | "agent";
  content: string;
  agentId: string;
  timestamp: Date;
};

const agents: AgentType[] = [
  {
    id: "js-ts",
    name: "JavaScript/TypeScript Expert",
    language: "JavaScript/TypeScript",
    expertise: ["React", "Node.js", "Next.js", "TypeScript", "ES6+", "Async/Await"],
    color: "from-yellow-500 to-blue-500",
    icon: "JS/TS"
  },
  {
    id: "html-css",
    name: "HTML/CSS Specialist",
    language: "HTML/CSS",
    expertise: ["Tailwind CSS", "Responsive Design", "Animations", "Flexbox", "Grid", "Accessibility"],
    color: "from-orange-500 to-pink-500",
    icon: "HTML"
  },
  {
    id: "python",
    name: "Python Developer",
    language: "Python",
    expertise: ["Django", "FastAPI", "Data Science", "Machine Learning", "Pandas", "NumPy"],
    color: "from-blue-600 to-cyan-500",
    icon: "PY"
  },
  {
    id: "solidity",
    name: "Solidity Blockchain Expert",
    language: "Solidity",
    expertise: ["Smart Contracts", "Web3", "DeFi", "NFTs", "Gas Optimization", "Security"],
    color: "from-purple-600 to-indigo-600",
    icon: "SOL"
  },
  {
    id: "rust",
    name: "Rust Systems Engineer",
    language: "Rust",
    expertise: ["Systems Programming", "WebAssembly", "Performance", "Memory Safety", "Cargo", "Async"],
    color: "from-red-600 to-orange-600",
    icon: "RS"
  }
];

export default function AIAgentPanel() {
  const [selectedAgent, setSelectedAgent] = useState(agents[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      agentId: selectedAgent.id,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "agent",
        content: generateMockResponse(selectedAgent, input),
        agentId: selectedAgent.id,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, agentMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const generateMockResponse = (agent: AgentType, userInput: string): string => {
    const responses: Record<string, string> = {
      "js-ts": `Here's a TypeScript solution:\n\n\`\`\`typescript\ninterface User {\n  id: string;\n  name: string;\n  email: string;\n}\n\nconst fetchUser = async (id: string): Promise<User> => {\n  const response = await fetch(\`/api/users/\${id}\`);\n  if (!response.ok) throw new Error('Failed to fetch user');\n  return response.json();\n};\n\`\`\`\n\nThis implements type-safe error handling with async/await. Consider adding retry logic and caching for production use.`,
      "html-css": `Here's a responsive CSS solution using Tailwind:\n\n\`\`\`html\n<div class="flex flex-col md:flex-row gap-4 p-6">\n  <div class="flex-1 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 p-8">\n    <h2 class="text-2xl font-bold text-white">Card Title</h2>\n  </div>\n</div>\n\`\`\`\n\nThis uses Flexbox for responsive layout with mobile-first design principles.`,
      "python": `Here's a Python implementation:\n\n\`\`\`python\nfrom fastapi import FastAPI, HTTPException\nfrom pydantic import BaseModel\n\napp = FastAPI()\n\nclass User(BaseModel):\n    id: int\n    name: str\n    email: str\n\n@app.get("/users/{user_id}")\nasync def get_user(user_id: int) -> User:\n    # Add your database logic here\n    return User(id=user_id, name="John", email="john@example.com")\n\`\`\`\n\nThis uses FastAPI with type hints and automatic API documentation.`,
      "solidity": `Here's a Solidity smart contract:\n\n\`\`\`solidity\n// SPDX-License-Identifier: MIT\npragma solidity ^0.8.20;\n\ncontract SimpleStorage {\n    mapping(address => uint256) private balances;\n    \n    event BalanceUpdated(address indexed user, uint256 newBalance);\n    \n    function setBalance(uint256 amount) external {\n        balances[msg.sender] = amount;\n        emit BalanceUpdated(msg.sender, amount);\n    }\n    \n    function getBalance() external view returns (uint256) {\n        return balances[msg.sender];\n    }\n}\n\`\`\`\n\nThis follows best practices with events, access control, and gas optimization.`,
      "rust": `Here's a Rust implementation:\n\n\`\`\`rust\nuse std::collections::HashMap;\n\n#[derive(Debug, Clone)]\nstruct User {\n    id: u32,\n    name: String,\n    email: String,\n}\n\nimpl User {\n    fn new(id: u32, name: String, email: String) -> Self {\n        Self { id, name, email }\n    }\n}\n\nfn main() {\n    let mut users: HashMap<u32, User> = HashMap::new();\n    users.insert(1, User::new(1, "Alice".to_string(), "alice@example.com".to_string()));\n}\n\`\`\`\n\nThis demonstrates Rust's ownership system with zero-cost abstractions.`
    };

    return responses[agent.id] || "I'm analyzing your request. Could you provide more details about what you'd like to accomplish?";
  };

  const copyToClipboard = (text: string, messageId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(messageId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <Card className="w-full h-[600px] flex flex-col border-2">
      <div className="border-b border-border p-4">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">AI Code Agents</h2>
        </div>
        
        <Tabs value={selectedAgent.id} onValueChange={(value) => {
          const agent = agents.find(a => a.id === value);
          if (agent) setSelectedAgent(agent);
        }}>
          <TabsList className="w-full grid grid-cols-5">
            {agents.map(agent => (
              <TabsTrigger key={agent.id} value={agent.id} className="text-xs">
                {agent.icon}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="p-4 border-b border-border">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${selectedAgent.color} flex items-center justify-center text-white font-bold text-sm`}>
            {selectedAgent.icon}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{selectedAgent.name}</h3>
            <div className="flex flex-wrap gap-1 mt-2">
              {selectedAgent.expertise.slice(0, 3).map((skill, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <AnimatePresence>
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <Code2 className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Start a conversation with the {selectedAgent.name} to get code help, suggestions, and improvements.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.filter(m => m.agentId === selectedAgent.id).map((message, idx) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[80%] ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"} rounded-lg p-4`}>
                    <div className="text-sm whitespace-pre-wrap break-words">
                      {message.content}
                    </div>
                    {message.role === "agent" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 h-6"
                        onClick={() => copyToClipboard(message.content, message.id)}
                      >
                        {copiedId === message.id ? (
                          <Check className="w-3 h-3 mr-1" />
                        ) : (
                          <Copy className="w-3 h-3 mr-1" />
                        )}
                        {copiedId === message.id ? "Copied" : "Copy"}
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-muted-foreground mt-4"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">{selectedAgent.name} is thinking...</span>
          </motion.div>
        )}
      </ScrollArea>

      <div className="border-t border-border p-4">
        <div className="flex gap-2">
          <Textarea
            placeholder={`Ask ${selectedAgent.name} for help...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="min-h-[60px] resize-none"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="self-end"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </Card>
  );
}