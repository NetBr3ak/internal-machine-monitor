import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
	children: ReactNode;
}

interface State {
	hasError: boolean;
	error: Error | null;
	errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
	public state: State = {
		hasError: false,
		error: null,
		errorInfo: null
	};

	public static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error, errorInfo: null };
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error('Uncaught error:', error, errorInfo);
		this.setState({ errorInfo });
	}

	public render() {
		if (this.state.hasError) {
			return (
				<div className="p-8 bg-neutral-900 text-white h-screen overflow-auto font-mono">
					<h1 className="text-2xl font-bold text-red-500 mb-4">Something went wrong</h1>
					<div className="mb-4 p-4 bg-red-950/30 border border-red-500/50 rounded text-red-200">
						{this.state.error && this.state.error.toString()}
					</div>
					<pre className="bg-black p-4 rounded border border-neutral-800 text-xs text-neutral-400 whitespace-pre-wrap overflow-x-auto">
						{this.state.errorInfo && this.state.errorInfo.componentStack}
					</pre>
				</div>
			);
		}

		return this.props.children;
	}
}
