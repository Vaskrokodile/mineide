import React, { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { Send, Loader2, Trash2, FileText, FolderOpen, X, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { ChatMessage, FileContext } from '@/api/ai';
import { AIService } from '@/api/ai-service';

interface AIChatboxProps {
  aiService: AIService | null;
  fileContext: FileContext[];
  onFileSelect: () => void;
  onClearContext: () => void;
}

interface FileEdit {
  path: string;
  originalContent: string;
  newContent: string;
  status: 'pending' | 'applied' | 'error';
}

export const AIChatbox: React.FC<AIChatboxProps> = ({
  aiService,
  fileContext,
  onFileSelect,
  onClearContext,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingEdits, setPendingEdits] = useState<FileEdit[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !aiService || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      const response = await aiService.sendMessage(
        [...messages, userMessage],
        fileContext,
        (chunk) => {
          setMessages(prev =>
            prev.map(msg =>
              msg.id === assistantMessage.id
                ? { ...msg, content: msg.content + chunk }
                : msg
            )
          );
        }
      );

      const edits = parseFileEdits(response);
      setPendingEdits(edits);
    } catch (error: any) {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messages[messages.length - 1]?.id
            ? { ...msg, content: `Error: ${error.message}` }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const parseFileEdits = (content: string): FileEdit[] => {
    const edits: FileEdit[] = [];
    const editRegex = /```(\/\S+|\S+\.\w+)\n([\s\S]*?)```/g;
    let match;

    while ((match = editRegex.exec(content)) !== null) {
      const path = match[1];
      const newContent = match[2].trim();

      const existingFile = fileContext.find(f => f.path === path);
      edits.push({
        path,
        originalContent: existingFile?.content || '',
        newContent,
        status: 'pending',
      });
    }

    return edits;
  };

  const applyEdit = async (edit: FileEdit) => {
    if (edit.path.startsWith('/')) {
      try {
        await window.fs?.writeFile(edit.path, edit.newContent, 'utf8');
        setPendingEdits(prev =>
          prev.map(e =>
            e.path === edit.path ? { ...e, status: 'applied' } : e
          )
        );
      } catch (error) {
        setPendingEdits(prev =>
          prev.map(e =>
            e.path === edit.path ? { ...e, status: 'error' } : e
          )
        );
      }
    }
  };

  const applyAllEdits = async () => {
    for (const edit of pendingEdits.filter(e => e.status === 'pending')) {
      await applyEdit(edit);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    setPendingEdits([]);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-[var(--theme-primary)]" />
          <span className="text-sm font-medium">AI Assistant</span>
          {fileContext.length > 0 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--theme-primary)]/10 text-[var(--theme-primary)]">
              {fileContext.length} files
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={onFileSelect} className="h-7 w-7">
            <FolderOpen className="h-3.5 w-3.5" />
          </Button>
          {fileContext.length > 0 && (
            <Button variant="ghost" size="icon" onClick={onClearContext} className="h-7 w-7">
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={clearMessages} className="h-7 w-7">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="mx-auto w-12 h-12 rounded-xl bg-[var(--theme-primary)]/10 flex items-center justify-center mb-3">
              <FileText className="h-6 w-6 text-[var(--theme-primary)]" />
            </div>
            <p className="text-sm font-medium text-[var(--foreground)]">AI Coding Assistant</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">
              Ask me to read, modify, or create files in your project
            </p>
          </div>
        )}

        {messages.map(msg => (
          <div
            key={msg.id}
            className={clsx(
              'flex',
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={clsx(
                'max-w-[85%] rounded-lg px-3 py-2 text-xs',
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-[var(--theme-button-primary)] to-[var(--theme-button-secondary)] text-white'
                  : 'bg-[var(--secondary)] text-[var(--foreground)]'
              )}
            >
              <div className="whitespace-pre-wrap font-mono leading-relaxed">
                {msg.content}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[var(--secondary)] rounded-lg px-3 py-2">
              <Loader2 className="h-4 w-4 animate-spin text-[var(--theme-primary)]" />
            </div>
          </div>
        )}
      </div>

      {pendingEdits.length > 0 && (
        <div className="border-t border-[var(--border)] p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">Pending Changes</span>
            <Button size="sm" onClick={applyAllEdits} className="h-6 text-[10px]">
              Apply All
            </Button>
          </div>
          {pendingEdits.map(edit => (
            <div
              key={edit.path}
              className="flex items-center justify-between bg-[var(--secondary)] rounded px-2 py-1.5"
            >
              <span className="text-[10px] font-mono truncate flex-1">{edit.path}</span>
              <div className="flex items-center gap-1 ml-2">
                {edit.status === 'pending' && (
                  <button
                    onClick={() => applyEdit(edit)}
                    className="p-1 hover:bg-[var(--theme-primary)]/10 rounded"
                  >
                    <Check className="h-3 w-3 text-[var(--theme-primary)]" />
                  </button>
                )}
                {edit.status === 'applied' && (
                  <Check className="h-3 w-3 text-green-500" />
                )}
                {edit.status === 'error' && (
                  <AlertCircle className="h-3 w-3 text-red-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="border-t border-[var(--border)] p-3">
        <div className="flex gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask me to modify files..."
            className="flex-1 resize-none rounded-lg border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-xs text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--theme-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary)]/20"
            rows={1}
            disabled={!aiService || isLoading}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || !aiService || isLoading}
            className="h-auto"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};
