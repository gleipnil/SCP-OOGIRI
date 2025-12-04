try {
    require.resolve('ai/react');
    console.log('ai/react found');
} catch (e) {
    console.error('ai/react not found:', e.message);
}
