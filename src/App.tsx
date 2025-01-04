import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const api = import.meta.env.API_URL ?? 'https://safenet-vz39.onrender.com'

interface ApiResponse {
	product: { response: string; message: string };
}

const App: React.FC = () => {
	const [input, setInput] = useState<string>('');
	const [messages, setMessages] = useState<
		{ role: 'user' | 'ai'; text: string }[]
	>([]);
	const [loading, setLoading] = useState<boolean>(false);

	const handleSubmit = async () => {
		if (!input.trim()) {
			alert('Input cannot be empty');
			return;
		}

		const userMessage = { role: 'user', text: input };
		setMessages((prev: any) => [...prev, userMessage]);
		setInput('');
		setLoading(true);

		try {
			const res = await fetch(`${api}/api/v1/ai/gemini`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ message: input }),
			});

			if (!res.ok) {
				throw new Error('Failed to fetch response');
			}

			const data: ApiResponse = await res.json();
			const aiMessage = { role: 'ai', text: data.product.response };

			setMessages((prev: any) => [...prev, aiMessage]);
		} catch (error) {
			console.error('Error:', error);
			alert('Something went wrong!');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-slate-100 flex flex-col items-center px-6 overflow-hidden max-w-md mx-auto">
			<div className="bg-slate-500 text-white p-5 w-full flex justify-center items-center fixed top-0 max-w-md mx-auto">
				<h1 className="text-lg font-semibold">Codify AI</h1>
			</div>
			<div className="h-[96vh] w-full flex justify-center items-center">
				<div className="w-full flex flex-col h-[80vh] pb-3">
					<div className="flex-grow p-4 overflow-y-auto">
						{messages.map((message, index) => (
							<div
								key={index}
								className={`mb-4 flex ${
									message.role === 'user' ? 'justify-end' : 'justify-start'
								}`}
							>
								<div
									className={`max-w-[75%] p-3 rounded-lg ${
										message.role === 'user'
											? 'bg-slate-500 text-white'
											: 'bg-gray-200 text-gray-800'
									}`}
								>
									{message.role === 'ai' ? (
										<ReactMarkdown className="prose prose-slate">
											{message.text}
										</ReactMarkdown>
									) : (
										<p>{message.text}</p>
									)}
								</div>
							</div>
						))}
						{loading && (
							<div className="mb-4 flex justify-start">
								<div className="max-w-[75%] p-3 rounded-lg bg-gray-200 text-gray-800">
									<p>Typing...</p>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
			<div className="p-4 flex items-center fixed bottom-3 w-[90%] bg-white rounded-xl shadow-md max-w-md mx-auto">
				<textarea
					className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="Type your message..."
					rows={1}
				/>
				<button
					className={`ml-4 p-1 text-slate-500 font-semibold rounded-lg ${
						loading ? '' : 'text-slate-600'
					}`}
					onClick={handleSubmit}
					disabled={loading}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						className="size-6"
					>
						<path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
					</svg>
				</button>
			</div>
		</div>
	);
};

export default App;
