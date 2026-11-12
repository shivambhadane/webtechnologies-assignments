import React, { useState } from 'react';
import { 
  Code2, 
  Plus, 
  Copy, 
  Check, 
  Download, 
  Trash2, 
  Layers, 
  FileCode, 
  Box, 
  RotateCcw,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { generateJavaCodeForClass, generateAllJavaCode } from './utils/javaGenerator';

const DEFAULT_CLASSES = [
  {
    id: 'cls-1',
    name: 'Person',
    isAbstract: true,
    isInterface: false,
    parentClass: '',
    interfaces: [],
    attributes: [
      { name: 'id', type: 'int', visibility: '-' },
      { name: 'name', type: 'String', visibility: '-' },
      { name: 'email', type: 'String', visibility: '-' }
    ],
    methods: [
      { name: 'getDisplayRole', returnType: 'String', params: '', visibility: '+' }
    ]
  },
  {
    id: 'cls-2',
    name: 'Student',
    isAbstract: false,
    isInterface: false,
    parentClass: 'Person',
    interfaces: ['Serializable'],
    attributes: [
      { name: 'prn', type: 'String', visibility: '-' },
      { name: 'gpa', type: 'double', visibility: '-' },
      { name: 'semester', type: 'String', visibility: '-' }
    ],
    methods: [
      { name: 'calculateSgpa', returnType: 'double', params: '', visibility: '+' },
      { name: 'enrollCourse', returnType: 'void', params: 'String courseCode', visibility: '+' }
    ]
  },
  {
    id: 'cls-3',
    name: 'Course',
    isAbstract: false,
    isInterface: false,
    parentClass: '',
    interfaces: [],
    attributes: [
      { name: 'courseCode', type: 'String', visibility: '-' },
      { name: 'title', type: 'String', visibility: '-' },
      { name: 'credits', type: 'int', visibility: '-' }
    ],
    methods: [
      { name: 'getSyllabus', returnType: 'String', params: '', visibility: '+' }
    ]
  }
];

export default function App() {
  const [classes, setClasses] = useState(DEFAULT_CLASSES);
  const [selectedClassId, setSelectedClassId] = useState('cls-1');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('selected'); // 'selected' or 'all'
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Class Form State
  const [newClassName, setNewClassName] = useState('');
  const [newParentClass, setNewParentClass] = useState('');
  const [isNewAbstract, setIsNewAbstract] = useState(false);
  const [isNewInterface, setIsNewInterface] = useState(false);

  const selectedClass = classes.find(c => c.id === selectedClassId) || classes[0];

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (filename, content) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleAddClass = (e) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    const newClass = {
      id: 'cls-' + Date.now(),
      name: newClassName.trim(),
      parentClass: newParentClass.trim(),
      isAbstract: isNewAbstract,
      isInterface: isNewInterface,
      interfaces: [],
      attributes: [
        { name: 'id', type: 'int', visibility: '-' }
      ],
      methods: [
        { name: 'execute', returnType: 'void', params: '', visibility: '+' }
      ]
    };

    setClasses([...classes, newClass]);
    setSelectedClassId(newClass.id);
    setNewClassName('');
    setNewParentClass('');
    setIsNewAbstract(false);
    setIsNewInterface(false);
    setIsModalOpen(false);
  };

  const handleDeleteClass = (id) => {
    if (classes.length <= 1) {
      alert('Must maintain at least one class.');
      return;
    }
    const updated = classes.filter(c => c.id !== id);
    setClasses(updated);
    if (selectedClassId === id) {
      setSelectedClassId(updated[0].id);
    }
  };

  const handleAddAttribute = (classId) => {
    const name = prompt('Enter attribute name (e.g. age):');
    if (!name) return;
    const type = prompt('Enter data type (e.g. int, String, double):', 'String') || 'String';
    const vis = prompt('Enter visibility (+, -, #):', '-') || '-';

    setClasses(classes.map(c => {
      if (c.id === classId) {
        return {
          ...c,
          attributes: [...c.attributes, { name, type, visibility: vis }]
        };
      }
      return c;
    }));
  };

  const handleAddMethod = (classId) => {
    const name = prompt('Enter method name (e.g. getStatus):');
    if (!name) return;
    const returnType = prompt('Enter return type (e.g. void, String, int):', 'void') || 'void';
    const params = prompt('Enter parameters (e.g. int x, String y):', '') || '';

    setClasses(classes.map(c => {
      if (c.id === classId) {
        return {
          ...c,
          methods: [...c.methods, { name, returnType, params, visibility: '+' }]
        };
      }
      return c;
    }));
  };

  const activeCode = activeTab === 'selected' 
    ? (selectedClass ? generateJavaCodeForClass(selectedClass) : '')
    : generateAllJavaCode(classes);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      
      {/* Top Navbar */}
      <header style={{
        background: '#0f172a',
        borderBottom: '1px solid #1e293b',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#3b82f6', borderRadius: '10px', padding: '8px', display: 'flex', alignItems: 'center' }}>
            <Layers size={22} color="white" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>UMLClassGen</h1>
              <span style={{ background: '#1e293b', color: '#60a5fa', fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', border: '1px solid #3b82f6' }}>CS3111 Practical 7</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Web-Based UML Class Diagram &amp; Automatic Java Source Code Generator</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            onClick={() => setClasses(DEFAULT_CLASSES)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: '1px solid #334155', color: '#94a3b8', borderRadius: '8px', padding: '8px 14px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}
          >
            <RotateCcw size={15} /> Reset Template
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#2563eb', border: 'none', color: 'white', borderRadius: '8px', padding: '8px 16px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 700 }}
          >
            <Plus size={16} /> Add UML Class
          </button>
        </div>
      </header>

      {/* Main Workspace (Split View) */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Left Side: Visual UML Canvas */}
        <div className="canvas-grid" style={{ flex: '1.2', padding: '24px', overflowY: 'auto', borderRight: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Box size={18} color="#38bdf8" />
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9' }}>Visual UML Diagram Canvas</h2>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>({classes.length} classes defined)</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Click any card to inspect generated Java</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {classes.map((cls) => {
              const isSelected = cls.id === selectedClassId;
              return (
                <div 
                  key={cls.id}
                  onClick={() => setSelectedClassId(cls.id)}
                  style={{
                    background: '#131c2e',
                    border: isSelected ? '2px solid #3b82f6' : '1px solid #1e293b',
                    borderRadius: '12px',
                    boxShadow: isSelected ? '0 10px 25px -5px rgba(59, 130, 246, 0.25)' : '0 4px 6px -1px rgba(0,0,0,0.2)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                  }}
                >
                  {/* UML Compartment 1: Class Name & Stereotype */}
                  <div style={{
                    padding: '14px 16px',
                    background: isSelected ? '#1e293b' : '#0f172a',
                    borderBottom: '1px solid #1e293b',
                    textAlign: 'center',
                    position: 'relative'
                  }}>
                    {cls.isInterface && <div style={{ fontSize: '0.7rem', color: '#93c5fd', fontStyle: 'italic' }}>&lt;&lt;interface&gt;&gt;</div>}
                    {cls.isAbstract && <div style={{ fontSize: '0.7rem', color: '#fde047', fontStyle: 'italic' }}>&lt;&lt;abstract&gt;&gt;</div>}
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'white', margin: '2px 0' }}>{cls.name}</h3>
                    {cls.parentClass && (
                      <div style={{ fontSize: '0.75rem', color: '#38bdf8' }}>extends {cls.parentClass}</div>
                    )}
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteClass(cls.id); }}
                      style={{ position: 'absolute', top: '12px', right: '12px', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}
                      title="Delete Class"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* UML Compartment 2: Attributes */}
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #1e293b', flex: 1, minHeight: '80px', background: '#0b1329' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 700 }}>Attributes</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleAddAttribute(cls.id); }}
                        style={{ background: 'transparent', border: 'none', color: '#38bdf8', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
                      >
                        <Plus size={12} /> Add
                      </button>
                    </div>
                    {cls.attributes.length === 0 ? (
                      <span style={{ fontSize: '0.75rem', color: '#475569', fontStyle: 'italic' }}>No attributes</span>
                    ) : (
                      cls.attributes.map((attr, idx) => (
                        <div key={idx} style={{ fontFamily: 'Fira Code', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px' }}>
                          <span style={{ color: attr.visibility === '-' ? '#f87171' : '#4ade80', fontWeight: 700, marginRight: '6px' }}>{attr.visibility}</span>
                          <span style={{ color: '#e2e8f0' }}>{attr.name}</span>: <span style={{ color: '#93c5fd' }}>{attr.type}</span>
                        </div>
                      ))
                    )}
                  </div>

                  {/* UML Compartment 3: Methods */}
                  <div style={{ padding: '12px 16px', minHeight: '80px', background: '#080e1e' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 700 }}>Methods</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleAddMethod(cls.id); }}
                        style={{ background: 'transparent', border: 'none', color: '#38bdf8', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
                      >
                        <Plus size={12} /> Add
                      </button>
                    </div>
                    {cls.methods.length === 0 ? (
                      <span style={{ fontSize: '0.75rem', color: '#475569', fontStyle: 'italic' }}>No methods</span>
                    ) : (
                      cls.methods.map((m, idx) => (
                        <div key={idx} style={{ fontFamily: 'Fira Code', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px' }}>
                          <span style={{ color: '#4ade80', fontWeight: 700, marginRight: '6px' }}>{m.visibility}</span>
                          <span style={{ color: '#fbbf24' }}>{m.name}</span>({m.params}): <span style={{ color: '#93c5fd' }}>{m.returnType}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Real-Time Java Source Code Generator */}
        <div style={{ flex: '1', background: '#090d16', display: 'flex', flexDirection: 'column' }}>
          
          {/* Code Header & Controls */}
          <div style={{
            padding: '12px 20px',
            background: '#0d1322',
            borderBottom: '1px solid #1e293b',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileCode size={18} color="#f59e0b" />
              <div style={{ display: 'flex', background: '#1e293b', borderRadius: '6px', padding: '3px' }}>
                <button 
                  onClick={() => setActiveTab('selected')}
                  style={{
                    background: activeTab === 'selected' ? '#2563eb' : 'transparent',
                    border: 'none',
                    color: 'white',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  {selectedClass.name}.java
                </button>
                <button 
                  onClick={() => setActiveTab('all')}
                  style={{
                    background: activeTab === 'all' ? '#2563eb' : 'transparent',
                    border: 'none',
                    color: 'white',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  All Classes ({classes.length})
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => handleCopy(activeCode)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: '#1e293b',
                  border: '1px solid #334155',
                  color: 'white',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                {copied ? <Check size={14} color="#4ade80" /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy Code'}
              </button>

              <button 
                onClick={() => handleDownload(`${activeTab === 'selected' ? selectedClass.name : 'GeneratedArchitecture'}.java`, activeCode)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: '#2563eb',
                  border: 'none',
                  color: 'white',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                <Download size={14} /> Download .java
              </button>
            </div>
          </div>

          {/* Syntax Highlighted Code Viewer */}
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
            <pre style={{
              fontSize: '0.85rem',
              lineHeight: '1.6',
              color: '#93c5fd',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              <code>{activeCode}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Modal: Add New Class */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 999
        }}>
          <div style={{
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '16px',
            padding: '24px',
            width: '90%',
            maxWidth: '450px',
            color: 'white'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px' }}>Add New UML Class</h3>
            
            <form onSubmit={handleAddClass}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>Class Name</label>
                <input 
                  type="text" 
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="e.g. Professor"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: 'white' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>Parent Class (Inheritance - Optional)</label>
                <input 
                  type="text" 
                  value={newParentClass}
                  onChange={(e) => setNewParentClass(e.target.value)}
                  placeholder="e.g. Person"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: 'white' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={isNewAbstract} onChange={(e) => setIsNewAbstract(e.target.checked)} />
                  Abstract Class
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={isNewInterface} onChange={(e) => setIsNewInterface(e.target.checked)} />
                  Interface
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  style={{ background: 'transparent', border: '1px solid #334155', color: '#94a3b8', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{ background: '#2563eb', border: 'none', color: 'white', borderRadius: '8px', padding: '8px 20px', cursor: 'pointer', fontWeight: 700 }}
                >
                  Create Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
