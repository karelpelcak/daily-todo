import { Button } from './ui/button'
import { CloudSync } from 'lucide-react';

interface SyncButtonProps {
    className?: string;
    onSync?: () => void;
}

const SyncButton = ({ className, onSync }: SyncButtonProps) => {
    return (
        <Button className={className} onClick={onSync}>
            <CloudSync />
        </Button>
    )
}

export default SyncButton
