import { useState } from 'react';
import { X, Send, Copy, Check, Plus, Trash2, AlertCircle } from 'lucide-react';

interface APITestModalProps {
  isOpen: boolean;
  onClose: () => void;
  testUrl: string;
  setTestUrl: (url: string) => void;
  testMethod: string;
  setTestMethod: (method: string) => void;
  testHeaders: {key: string, value: string}[];
  setTestHeaders: (headers: {key: string, value: string}[]) => void;
  testParams: {key: string, value: string}[];
  setTestParams: (params: {key: string, value: string}[]) => void;
  testBody: string;
  setTestBody: (body: string) => void;
  testResponse: any;
  setTestResponse: (response: any) => void;
  isTestLoading: boolean;
  setIsTestLoading: (loading: boolean) => void;
}

export function APITestModal({
  isOpen,
  onClose,
  testUrl,
  setTestUrl,
  testMethod,
  setTestMethod,
  testHeaders,
  setTestHeaders,
  testParams,
  setTestParams,
  testBody,
  setTestBody,
  testResponse,
  setTestResponse,
  isTestLoading,
  setIsTestLoading
}: APITestModalProps) {
  const [copiedResponse, setCopiedResponse] = useState(false);

  const handleSendRequest = () => {
    setIsTestLoading(true);
    
    // Simulate API call with mock response
    setTimeout(() => {
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        headers: {
          'content-type': 'application/json',
          'x-request-id': 'req_' + Math.random().toString(36).substr(2, 9),
          'date': new Date().toUTCString()
        },
        data: {
          success: true,
          message: 'API test thành công',
          timestamp: new Date().toISOString(),
          data: {
            id: '12345',
            name: 'Nguyễn Văn A',
            email: 'nguyenvana@example.com',
            phone: '0123456789',
            address: 'Hà Nội, Việt Nam'
          },
          meta: {
            requestMethod: testMethod,
            requestUrl: testUrl,
            processingTime: '145ms'
          }
        }
      };
      
      setTestResponse(mockResponse);
      setIsTestLoading(false);
    }, 1500);
  };

  const handleCopyResponse = () => {
    if (testResponse) {
      navigator.clipboard.writeText(JSON.stringify(testResponse, null, 2));
      setCopiedResponse(true);
      setTimeout(() => setCopiedResponse(false), 2000);
    }
  };

  const addHeader = () => {
    setTestHeaders([...testHeaders, { key: '', value: '' }]);
  };

  const removeHeader = (index: number) => {
    setTestHeaders(testHeaders.filter((_, i) => i !== index));
  };

  const updateHeader = (index: number, field: 'key' | 'value', value: string) => {
    const newHeaders = [...testHeaders];
    newHeaders[index][field] = value;
    setTestHeaders(newHeaders);
  };

  const addParam = () => {
    setTestParams([...testParams, { key: '', value: '' }]);
  };

  const removeParam = (index: number) => {
    setTestParams(testParams.filter((_, i) => i !== index));
  };

  const updateParam = (index: number, field: 'key' | 'value', value: string) => {
    const newParams = [...testParams];
    newParams[index][field] = value;
    setTestParams(newParams);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-slate-900">Test API</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600" title="Đóng" aria-label="Đóng">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Left Panel - Request */}
          <div className="w-1/2 border-r border-slate-200 overflow-y-auto p-6 space-y-6">
            <div>
              <h3 className="text-sm text-slate-900 mb-4">Request</h3>
              
              {/* Method & URL */}
              <div className="space-y-3">
                <label className="block text-xs text-slate-600">Endpoint</label>
                <div className="flex gap-2">
                  <select
                    value={testMethod}
                    onChange={(e) => setTestMethod(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                  <input
                    type="text"
                    value={testUrl}
                    onChange={(e) => setTestUrl(e.target.value)}
                    placeholder="https://api.example.com/endpoint"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Headers */}
              <div className="space-y-3 mt-6">
                <div className="flex items-center justify-between">
                  <label className="block text-xs text-slate-600">Headers</label>
                  <button
                    onClick={addHeader}
                    className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Thêm
                  </button>
                </div>
                <div className="space-y-2">
                  {testHeaders.map((header, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={header.key}
                        onChange={(e) => updateHeader(index, 'key', e.target.value)}
                        placeholder="Key"
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={header.value}
                        onChange={(e) => updateHeader(index, 'value', e.target.value)}
                        placeholder="Value"
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => removeHeader(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {testHeaders.length === 0 && (
                    <div className="text-xs text-slate-500 py-2">Chưa có headers</div>
                  )}
                </div>
              </div>

              {/* Query Params */}
              <div className="space-y-3 mt-6">
                <div className="flex items-center justify-between">
                  <label className="block text-xs text-slate-600">Query Parameters</label>
                  <button
                    onClick={addParam}
                    className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Thêm
                  </button>
                </div>
                <div className="space-y-2">
                  {testParams.map((param, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={param.key}
                        onChange={(e) => updateParam(index, 'key', e.target.value)}
                        placeholder="Key"
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={param.value}
                        onChange={(e) => updateParam(index, 'value', e.target.value)}
                        placeholder="Value"
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => removeParam(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {testParams.length === 0 && (
                    <div className="text-xs text-slate-500 py-2">Chưa có query parameters</div>
                  )}
                </div>
              </div>

              {/* Body (only for POST/PUT) */}
              {(testMethod === 'POST' || testMethod === 'PUT') && (
                <div className="space-y-3 mt-6">
                  <label className="block text-xs text-slate-600">Body (JSON)</label>
                  <textarea
                    value={testBody}
                    onChange={(e) => setTestBody(e.target.value)}
                    placeholder='{\n  "key": "value"\n}'
                    rows={8}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Response */}
          <div className="w-1/2 overflow-y-auto p-6 bg-slate-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm text-slate-900">Response</h3>
              {testResponse && (
                <button
                  onClick={handleCopyResponse}
                  className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1"
                >
                  {copiedResponse ? (
                    <>
                      <Check className="w-3 h-3 text-green-600" />
                      <span className="text-green-600">Đã copy</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy
                    </>
                  )}
                </button>
              )}
            </div>

            {isTestLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <div className="text-sm text-slate-600">Đang gửi request...</div>
                </div>
              </div>
            ) : testResponse ? (
              <div className="space-y-4">
                {/* Status */}
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-slate-600">Status:</span>
                    <span className={`px-2 py-0.5 text-xs rounded ${
                      testResponse.status >= 200 && testResponse.status < 300
                        ? 'bg-green-100 text-green-700'
                        : testResponse.status >= 400
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {testResponse.status} {testResponse.statusText}
                    </span>
                  </div>
                </div>

                {/* Response Headers */}
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <div className="text-xs text-slate-600 mb-2">Response Headers:</div>
                  <div className="space-y-1 text-xs font-mono">
                    {Object.entries(testResponse.headers).map(([key, value]) => (
                      <div key={key} className="flex gap-2">
                        <span className="text-blue-600">{key}:</span>
                        <span className="text-slate-700">{value as string}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Response Body */}
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <div className="text-xs text-slate-600 mb-2">Response Body:</div>
                  <pre className="text-xs font-mono text-slate-900 overflow-x-auto whitespace-pre-wrap break-words">
                    {JSON.stringify(testResponse.data, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="text-center text-slate-500">
                  <AlertCircle className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                  <div className="text-sm">Nhấn "Gửi request" để test API</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            Đóng
          </button>
          <button
            onClick={handleSendRequest}
            disabled={isTestLoading || !testUrl}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:cursor-not-allowed flex items-center gap-2 disabled:!bg-[#F1F5F9] disabled:!text-[#94A3B8] disabled:!border-[#E2E8F0] disabled:!shadow-none "
          >
            <Send className="w-4 h-4" />
            Gửi request
          </button>
        </div>
      </div>
    </div>
  );
}
