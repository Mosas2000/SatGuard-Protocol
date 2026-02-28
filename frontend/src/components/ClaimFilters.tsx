import type { Claim } from '../types';

interface ClaimF iltersProps {
    onFilterChange: (filters: {
        status: 'all' | 0 | 1 | 2;
        sortBy: 'date' | 'amount' | 'votes';
    }) => void;
}

export default function ClaimFilters({ onFilterChange }: ClaimFiltersProps) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 flex gap-4 items-center">
            <select
                onChange={(e) => onFilterChange({ status: e.target.value as any, sortBy: 'date' })}
                className="px-4 py-2 border border-gray-200 rounded focus:border-stacks-orange outline-none"
            >
                <option value="all">All Claims</option>
                <option value="0">Pending</option>
                <option value="1">Approved</option>
                <option value="2">Rejected</option>
            </select>
            
            <select
                onChange={(e) => onFilterChange({ status: 'all', sortBy: e.target.value as any })}
                className="px-4 py-2 border border-gray-200 rounded focus:border-stacks-orange outline-none"
            >
                <option value="date">Sort by Date</option>
                <option value="amount">Sort by Amount</option>
                <option value="votes">Sort by Votes</option>
            </select>
        </div>
    );
}
