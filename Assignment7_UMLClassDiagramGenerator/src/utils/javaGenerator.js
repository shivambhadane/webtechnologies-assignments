/**
 * Java Source Code Generator for UML Class Diagram
 */

const getJavaModifier = (symbol) => {
  switch (symbol) {
    case '+': return 'public';
    case '-': return 'private';
    case '#': return 'protected';
    default: return 'public';
  }
};

const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const generateJavaCodeForClass = (cls, allClassMap = {}) => {
  const isInterface = cls.isInterface;
  const isAbstract = cls.isAbstract;

  let code = `// ========================================================\n`;
  code += `// Generated from UML Class Diagram\n`;
  code += `// Class: ${cls.name}\n`;
  code += `// ========================================================\n\n`;

  code += `package com.vit.generated;\n\n`;
  code += `import java.util.*;\nimport java.time.*;\n\n`;

  // Class declaration
  let decl = `public `;
  if (isAbstract) decl += `abstract `;
  decl += isInterface ? `interface ` : `class `;
  decl += cls.name;

  if (cls.parentClass && !isInterface) {
    decl += ` extends ${cls.parentClass}`;
  }
  if (cls.interfaces && cls.interfaces.length > 0) {
    decl += ` implements ${cls.interfaces.join(', ')}`;
  }
  decl += ` {\n\n`;
  code += decl;

  // 1. Attributes / Fields
  if (!isInterface && cls.attributes && cls.attributes.length > 0) {
    code += `    // --- Attributes ---\n`;
    cls.attributes.forEach((attr) => {
      const mod = getJavaModifier(attr.visibility);
      code += `    ${mod} ${attr.type} ${attr.name};\n`;
    });
    code += `\n`;
  }

  // 2. Constructors (Classes only)
  if (!isInterface) {
    // Default constructor
    code += `    // --- Default Constructor ---\n`;
    code += `    public ${cls.name}() {\n`;
    if (cls.parentClass) {
      code += `        super();\n`;
    }
    code += `    }\n\n`;

    // Parameterized constructor if attributes exist
    if (cls.attributes && cls.attributes.length > 0) {
      const params = cls.attributes.map(a => `${a.type} ${a.name}`).join(', ');
      code += `    // --- Parameterized Constructor ---\n`;
      code += `    public ${cls.name}(${params}) {\n`;
      if (cls.parentClass) {
        code += `        super();\n`;
      }
      cls.attributes.forEach((attr) => {
        code += `        this.${attr.name} = ${attr.name};\n`;
      });
      code += `    }\n\n`;
    }

    // 3. Getters and Setters
    if (cls.attributes && cls.attributes.length > 0) {
      code += `    // --- Getters & Setters ---\n`;
      cls.attributes.forEach((attr) => {
        const cap = capitalize(attr.name);
        // Getter
        code += `    public ${attr.type} get${cap}() {\n`;
        code += `        return this.${attr.name};\n`;
        code += `    }\n\n`;
        // Setter
        code += `    public void set${cap}(${attr.type} ${attr.name}) {\n`;
        code += `        this.${attr.name} = ${attr.name};\n`;
        code += `    }\n\n`;
      });
    }
  }

  // 4. Methods
  if (cls.methods && cls.methods.length > 0) {
    code += `    // --- Methods ---\n`;
    cls.methods.forEach((m) => {
      const mod = isInterface ? '' : `${getJavaModifier(m.visibility)} `;
      const params = m.params || '';
      const ret = m.returnType || 'void';

      if (isInterface) {
        code += `    ${ret} ${m.name}(${params});\n\n`;
      } else {
        code += `    ${mod}${ret} ${m.name}(${params}) {\n`;
        if (ret === 'void') {
          code += `        // TODO: Implement ${m.name}\n`;
        } else if (ret === 'boolean') {
          code += `        return false;\n`;
        } else if (['int', 'double', 'float', 'long'].includes(ret)) {
          code += `        return 0;\n`;
        } else {
          code += `        return null;\n`;
        }
        code += `    }\n\n`;
      }
    });
  }

  code += `}\n`;
  return code;
};

export const generateAllJavaCode = (classes) => {
  const map = {};
  classes.forEach(c => map[c.name] = c);
  return classes.map(c => generateJavaCodeForClass(c, map)).join('\n\n');
};
