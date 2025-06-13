// This file is no longer needed as we're using DashboardPage as the main index
// Keeping it as fallback but it shouldn't be reached with current routing

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to TheFutureClassroom</h1>
        <p className="text-xl text-muted-foreground">This page should not be reached with current routing</p>
      </div>
    </div>
  );
};

export default Index;
