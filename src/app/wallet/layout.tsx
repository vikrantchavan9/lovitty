import { ReactNode } from "react";

export default function WalletLayout({ children }: { children: ReactNode }) {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">My Wallet</h1>
                <p className="text-muted-foreground">Manage your Heartbeats and recharge your balance.</p>
            </div>
            {children}
        </div>
    );
}
