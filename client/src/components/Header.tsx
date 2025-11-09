import { Sparkles } from "lucide-react";
import { Link } from "wouter";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 hover-elevate rounded-md px-3 py-2 -ml-3" data-testid="link-home">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">GenAIMagic.io</h1>
            <p className="text-xs text-muted-foreground">From Product to Profit—Effortlessly</p>
          </div>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
