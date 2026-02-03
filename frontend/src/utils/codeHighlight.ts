// Utility to get highlight line based on algorithm and description
export const getHighlightLine = (algorithm: string, description: string): number => {
    const desc = description.toLowerCase();

    if (algorithm === 'bubble') {
        if (desc.includes('comparing')) return 4;
        if (desc.includes('swapping')) return 6;
        if (desc.includes('sorted')) return 10;
    } else if (algorithm === 'selection') {
        if (desc.includes('finding minimum') || desc.includes('comparing')) return 5;
        if (desc.includes('swapping')) return 10;
        if (desc.includes('sorted')) return 12;
    } else if (algorithm === 'insertion') {
        if (desc.includes('inserting')) return 2;
        if (desc.includes('moving')) return 6;
        if (desc.includes('sorted')) return 12;
    } else if (algorithm === 'merge') {
        if (desc.includes('merging')) return 7;
        if (desc.includes('placing')) return 15;
        if (desc.includes('sorted')) return 7;
    } else if (algorithm === 'quick') {
        if (desc.includes('pivot')) return 10;
        if (desc.includes('comparing')) return 14;
        if (desc.includes('swapping')) return 17;
        if (desc.includes('placing pivot') || desc.includes('correct position')) return 20;
        if (desc.includes('sorted')) return 6;
    } else if (algorithm === 'heap') {
        if (desc.includes('heapifying') || desc.includes('comparing')) return 17;
        if (desc.includes('swapping')) return 24;
        if (desc.includes('moving max')) return 8;
        if (desc.includes('sorted')) return 10;
    } else if (algorithm === 'bucket') {
        if (desc.includes('creating')) return 2;
        if (desc.includes('placing') || desc.includes('into bucket')) return 5;
        if (desc.includes('distributed')) return 7;
        if (desc.includes('bucket') && desc.includes('sorted')) return 10;
        if (desc.includes('adding') || desc.includes('from bucket')) return 15;
        if (desc.includes('array sorted')) return 18;
    }

    return 0;
};
