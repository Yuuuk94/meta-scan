export const RootBackground = ({
  children,
}: RootLayoutProps)=>{
    return (
        <main className="min-h-screen bg-black text-white relative overflow-hidden">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"/>
            {children}
        </main>
    )
}