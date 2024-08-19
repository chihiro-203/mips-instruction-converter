# mips-instruction-converter

##  Set up Project Environment
#### 1. Create Project folders:
- ```mkdir backend```
- ```mkdir frontend```
#### 2. Set up the Frontend:
- Creating a new Vite project (Framework: React; Variant: JavaScript): 
```npm create vite@latest note-app```
- Now run to install:
```cd note-app```
```npm install```
```npm install react-router-dom react-icons react-modal axios moment```
- Run Frontend:
```npm run dev```

#### 3. Set up the Backend:
- ... (not need):
```npm init```
- ...:
```npm install express mongoose jsonwebtoken dotenv cors nodemon```
- Run Backend (Server):
```npm start```


## Reference:
It sounds like you might be encountering an issue with the format of a MIPS instruction. MIPS instructions come in different formats, primarily R-type, I-type, and J-type, each with its own structure:

1. **R-type (Register)**: Used for arithmetic and logical operations.
   - Format: `opcode rs rt rd shamt funct`
   - Example: `add $s1, $s2, $s3` (adds the values in `$s2` and `$s3`, stores the result in `$s1`)

2. **I-type (Immediate)**: Used for instructions with immediate values.
   - Format: `opcode rs rt immediate`
   - Example: `addi $s1, $s2, 100` (adds the value in `$s2` and the immediate value `100`, stores the result in `$s1`)

3. **J-type (Jump)**: Used for jump instructions.
   - Format: `opcode address`
   - Example: `j 10000` (jumps to the address `10000`)


