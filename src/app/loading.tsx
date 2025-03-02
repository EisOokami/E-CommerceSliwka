export default function Loading() {
    return (
        <div className="fixed inset-0 flex justify-center items-center bg-white">
            <div className="animate-spin h-12 w-12 border-t-4 border-pink-600 rounded-full" />
        </div>
    );
}
