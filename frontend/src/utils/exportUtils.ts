import type { Pool } from '../types';

export const exportPoolsToCSV = (pools: Pool[]) => {
    const headers = ['Pool ID', 'Coverage Type', 'Total Funds (STX)', 'Min Contribution', 'Max Coverage', 'Contributors', 'Status', 'Created At'];
    
    const rows = pools.map(pool => [
        pool.poolId,
        pool.coverageType,
        (pool.totalFunds / 1000000).toFixed(6),
        (pool.minContribution / 1000000).toFixed(6),
        (pool.maxCoverage / 1000000).toFixed(6),
        pool.contributorCount,
        pool.status === 1 ? 'Active' : 'Closed',
        new Date(pool.createdAt * 1000).toLocaleDateString()
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `pools_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const exportPoolsToJSON = (pools: Pool[]) => {
    const dataStr = JSON.stringify(pools, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `pools_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
