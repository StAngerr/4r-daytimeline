import React, { useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';

interface ExampleLayoutProps {
    code: string;
    component: React.ReactNode;
}

export const ExampleLayout: React.FC<ExampleLayoutProps> = ({
    code,
    component,
}) => {
    const [activeTab, setActiveTab] = useState<'component' | 'code'>(
        'component',
    );

    return (
        <div className="w-full h-full flex flex-col overflow-hidden">
            <div className="flex border-b h-12 flex-shrink-0">
                <button
                    className={`flex-1 p-2 ${activeTab === 'component' ? 'border-b-2 border-blue-600' : ''}`}
                    onClick={() => setActiveTab('component')}
                >
                    Preview
                </button>
                <button
                    className={`flex-1 p-2 ${activeTab === 'code' ? 'border-b-2 border-blue-600' : ''}`}
                    onClick={() => setActiveTab('code')}
                >
                    Code
                </button>
            </div>
            <div className="flex-1 p-4 overflow-hidden">
                {activeTab === 'component' ? (
                    <div className="border rounded-lg shadow-sm bg-white h-full mx-auto w-full max-w-4xl overflow-hidden">
                        {component}
                    </div>
                ) : (
                    <div className="mx-auto w-full h-full overflow-auto">
                        <SyntaxHighlighter language={'JavaScript'}>
                            {code}
                        </SyntaxHighlighter>
                    </div>
                )}
            </div>
        </div>
    );
};
