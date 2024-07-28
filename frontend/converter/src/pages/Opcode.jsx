import React from "react";
import Navbar from "../components/Navbar";

const Opcode = () => {
  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="ref-title">MIPS Opcode Reference</div>
        <div className="ref-data">
          <table
            className="ref-table table-light table-striped table-bordered table-responsive-sm"
            id="myTable"
          >
            <thead className="thead-dark">
              <tr>
                <th>Opcode</th>
                <th>Name</th>
                <th>Mnemonic</th>
                <th>Format</th>
                <th>Action</th>
                <th colSpan={6}>Fields</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={11}>
                  <b>Arithmetic Logic Unit</b>
                </td>
              </tr>
              <tr>
                <td>ADD rd,rs,rt</td>
                <td>Add</td>
                <td>add</td>
                <td>R</td>
                <td>rd=rs+rt</td>
                <td>000000</td>
                <td>rs</td>
                <td>rt</td>
                <td>rd</td>
                <td>00000</td>
                <td>100000</td>
              </tr>
              <tr>
                <td>ADDI rt,rs,imm</td>
                <td>Add Immediate</td>
                <td>addi</td>
                <td>I</td>
                <td>rt=rs+imm</td>
                <td>001000</td>
                <td>rs</td>
                <td>rt</td>
                <td colSpan={3}>imm</td>
              </tr>
              <tr>
                <td>ADDIU rt,rs,imm</td>
                <td>Add Immediate Unsigned</td>
                <td>addiu</td>
                <td>I</td>
                <td>rt=rs+imm</td>
                <td>001001</td>
                <td>rs</td>
                <td>rt</td>
                <td colSpan={3}>imm</td>
              </tr>
              <tr>
                <td>ADDU rd,rs,rt</td>
                <td>Add Unsigned</td>
                <td>addu</td>
                <td>R</td>
                <td>rd=rs+rt</td>
                <td>000000</td>
                <td>rs</td>
                <td>rt</td>
                <td>rd</td>
                <td>00000</td>
                <td>100001</td>
              </tr>
              <tr>
                <td>AND rd,rs,rt</td>
                <td>And</td>
                <td>and</td>
                <td>R</td>
                <td>rd=rs&amp;rt</td>
                <td>000000</td>
                <td>rs</td>
                <td>rt</td>
                <td>rd</td>
                <td>00000</td>
                <td>100100</td>
              </tr>
              <tr>
                <td>ANDI rt,rs,imm</td>
                <td>And Immediate</td>
                <td>andi</td>
                <td>I</td>
                <td>rt=rs&amp;imm</td>
                <td>001100</td>
                <td>rs</td>
                <td>rt</td>
                <td colSpan={3}>imm</td>
              </tr>
              <tr>
                <td>LUI rt,imm</td>
                <td>Load Upper Immediate</td>
                <td>lui</td>
                <td>I</td>
                <td>rt=imm&lt;&lt;16</td>
                <td>001111</td>
                <td>rs</td>
                <td>rt</td>
                <td colSpan={3}>imm</td>
              </tr>
              <tr>
                <td>NOR rd,rs,rt</td>
                <td>Nor</td>
                <td>nor</td>
                <td>R</td>
                <td>rd=~(rs|rt)</td>
                <td>000000</td>
                <td>rs</td>
                <td>rt</td>
                <td>rd</td>
                <td>00000</td>
                <td>100111</td>
              </tr>
              <tr>
                <td>OR rd,rs,rt</td>
                <td>Or</td>
                <td>or</td>
                <td>R</td>
                <td>rd=rs|rt</td>
                <td>000000</td>
                <td>rs</td>
                <td>rt</td>
                <td>rd</td>
                <td>00000</td>
                <td>100101</td>
              </tr>
              <tr>
                <td>ORI rt,rs,imm</td>
                <td>Or Immediate</td>
                <td>ori</td>
                <td>I</td>
                <td>rt=rs|imm</td>
                <td>001101</td>
                <td>rs</td>
                <td>rt</td>
                <td colSpan={3}>imm</td>
              </tr>
              <tr>
                <td>SLT rd,rs,rt</td>
                <td>Set On Less Than</td>
                <td>slt</td>
                <td>R</td>
                <td>rd=rs&lt;rt</td>
                <td>000000</td>
                <td>rs</td>
                <td>rt</td>
                <td>rd</td>
                <td>00000</td>
                <td>101010</td>
              </tr>
              <tr>
                <td>SLTI rt,rs,imm</td>
                <td>Set On Less Than Immediate</td>
                <td>slti</td>
                <td>I</td>
                <td>rt=rs&lt;imm</td>
                <td>001010</td>
                <td>rs</td>
                <td>rt</td>
                <td colSpan={3}>imm</td>
              </tr>
              <tr>
                <td>SLTIU rt,rs,imm</td>
                <td>Set On &lt; Immediate Unsigned</td>
                <td>sltiu</td>
                <td>I</td>
                <td>rt=rs&lt;imm</td>
                <td>001011</td>
                <td>rs</td>
                <td>rt</td>
                <td colSpan={3}>imm</td>
              </tr>
              <tr>
                <td>SLTU rd,rs,rt</td>
                <td>Set On Less Than Unsigned</td>
                <td>sltu</td>
                <td>R</td>
                <td>rd=rs&lt;rt</td>
                <td>000000</td>
                <td>rs</td>
                <td>rt</td>
                <td>rd</td>
                <td>00000</td>
                <td>101011</td>
              </tr>
              <tr>
                <td>SUB rd,rs,rt</td>
                <td>Subtract</td>
                <td>sub</td>
                <td>R</td>
                <td>rd=rs-rt</td>
                <td>000000</td>
                <td>rs</td>
                <td>rt</td>
                <td>rd</td>
                <td>00000</td>
                <td>100010</td>
              </tr>
              <tr>
                <td>SUBU rd,rs,rt</td>
                <td>Subtract Unsigned</td>
                <td>subu</td>
                <td>R</td>
                <td>rd=rs-rt</td>
                <td>000000</td>
                <td>rs</td>
                <td>rt</td>
                <td>rd</td>
                <td>00000</td>
                <td>100011</td>
              </tr>
              <tr>
                <td>XOR rd,rs,rt</td>
                <td>Exclusive Or</td>
                <td>xor</td>
                <td>R</td>
                <td>rd=rs^rt</td>
                <td>000000</td>
                <td>rs</td>
                <td>rt</td>
                <td>rd</td>
                <td>00000</td>
                <td>100110</td>
              </tr>
              <tr>
                <td>XORI rt,rs,imm</td>
                <td>Exclusive Or Immediate</td>
                <td>xori</td>
                <td>I</td>
                <td>rt=rs^imm</td>
                <td>001110</td>
                <td>rs</td>
                <td>rt</td>
                <td colSpan={3}>imm</td>
              </tr>

              <tr>
                <td colSpan={11}>
                  <b>Shifter</b>
                </td>
              </tr>
              <tr>
                <td>SLL rd,rt,sa</td>
                <td>Shift Left Logical</td>
                <td>sll</td>
                <td>R</td>
                <td>rd=rt&lt;&lt;sa</td>
                <td>000000</td>
                <td>rs</td>
                <td>rt</td>
                <td>rd</td>
                <td>sa</td>
                <td>000000</td>
              </tr>
              <tr>
                <td>SLLV rd,rt,rs</td>
                <td>Shift Left Logical Variable</td>
                <td>sllv</td>
                <td>R</td>
                <td>rd=rt&lt;&lt;rs</td>
                <td>000000</td>
                <td>rs</td>
                <td>rt</td>
                <td>rd</td>
                <td>00000</td>
                <td>000100</td>
              </tr>
              <tr>
                <td>SRA rd,rt,sa</td>
                <td>Shift Right Arithmetic</td>
                <td>sra</td>
                <td>R</td>
                <td>rd=rt&gt;&gt;sa</td>
                <td>000000</td>
                <td>rs</td>
                <td>rt</td>
                <td>rd</td>
                <td>sa</td>
                <td>000011</td>
              </tr>
              <tr>
                <td>SRAV rd,rt,rs</td>
                <td>Shift Right Arithmetic Variable</td>
                <td>srav</td>
                <td>R</td>
                <td>rd=rt&gt;&gt;rs</td>
                <td>000000</td>
                <td>rs</td>
                <td>rt</td>
                <td>rd</td>
                <td>00000</td>
                <td>000111</td>
              </tr>
              <tr>
                <td>SRL rd,rt,sa</td>
                <td>Shift Right Logical</td>
                <td>srl</td>
                <td>R</td>
                <td>rd=rt&gt;&gt;sa</td>
                <td>000000</td>
                <td>rs</td>
                <td>rt</td>
                <td>rd</td>
                <td>sa</td>
                <td>000010</td>
              </tr>
              <tr>
                <td>SRLV rd,rt,rs</td>
                <td>Shift Right Logical Variable</td>
                <td>srlv</td>
                <td>R</td>
                <td>rd=rt&gt;&gt;rs</td>
                <td>000000</td>
                <td>rs</td>
                <td>rt</td>
                <td>rd</td>
                <td>00000</td>
                <td>000110</td>
              </tr>

              <tr>
                <td colSpan={11}>
                  <b>Multiply</b>
                </td>
              </tr>
              <tr>
                <td>DIV rs,rt</td>
                <td>Divide</td>
                <td>div</td>
                <td>R</td>
                <td>HI=rs%rt; LO=rs/rt</td>
                <td>000000</td>
                <td>rs</td>
                <td>rt</td>
                <td colSpan={2}>0000000000</td>
                <td>011010</td>
              </tr>
              <tr>
                <td>DIVU rs,rt</td>
                <td>Divide Unsigned</td>
                <td>divu</td>
                <td>R</td>
                <td>HI=rs%rt; LO=rs/rt</td>
                <td>000000</td>
                <td>rs</td>
                <td>rt</td>
                <td colSpan={2}>0000000000</td>
                <td>011011</td>
              </tr>
              <tr>
                <td>MFHI rd</td>
                <td>Move From HI</td>
                <td>mfhi</td>
                <td>R</td>
                <td>rd=HI</td>
                <td>000000</td>
                <td colSpan={2}>0000000000</td>
                <td>rd</td>
                <td>00000</td>
                <td>010000</td>
              </tr>
              <tr>
                <td>MFLO rd</td>
                <td>Move From LO</td>
                <td>mflo</td>
                <td>R</td>
                <td>rd=LO</td>
                <td>000000</td>
                <td colSpan={2}>0000000000</td>
                <td>rd</td>
                <td>00000</td>
                <td>010010</td>
              </tr>
              <tr>
                <td>MTHI rs</td>
                <td>Move To HI</td>
                <td>mthi</td>
                <td>R</td>
                <td>HI=rs</td>
                <td>000000</td>
                <td>rs</td>
                <td colSpan={3}>000000000000000</td>
                <td>010001</td>
              </tr>
              <tr>
                <td>MTLO rs</td>
                <td>Move To LO</td>
                <td>mtlo</td>
                <td>R</td>
                <td>LO=rs</td>
                <td>000000</td>
                <td>rs</td>
                <td colSpan={3}>000000000000000</td>
                <td>010011</td>
              </tr>
              <tr>
                <td>MULT rs,rt</td>
                <td>Multiply</td>
                <td>mult</td>
                <td>R</td>
                <td>HI,LO=rs*rt</td>
                <td>000000</td>
                <td>rs</td>
                <td>rt</td>
                <td colSpan={2}>0000000000</td>
                <td>011000</td>
              </tr>
              <tr>
                <td>MULTU rs,rt</td>
                <td>Multiply Unsigned</td>
                <td>multu</td>
                <td>R</td>
                <td>HI,LO=rs*rt</td>
                <td>000000</td>
                <td>rs</td>
                <td>rt</td>
                <td colSpan={2}>0000000000</td>
                <td>011001</td>
              </tr>

              <tr>
                <td colSpan={11}>
                  <b>Branch</b>
                </td>
              </tr>
              <tr>
                <td>BEQ rs,rt,offset</td>
                <td>Branch On Equal</td>
                <td>beq</td>
                <td>I</td>
                <td>if(rs==rt) pc+=offset*4</td>
                <td>000100</td>
                <td>rs</td>
                <td>rt</td>
                <td colSpan={3}>offset</td>
              </tr>
              <tr>
                <td>BGEZ rs,offset</td>
                <td>Branch On &gt;= 0</td>
                <td>bgez</td>
                <td>I</td>
                <td>if(rs&gt;=0) pc+=offset*4</td>
                <td>000001</td>
                <td>rs</td>
                <td>00001</td>
                <td colSpan={3}>offset</td>
              </tr>
              <tr>
                <td>BGEZAL rs,offset</td>
                <td>Branch On &gt;= 0 And Link</td>
                <td>bgezal</td>
                <td>I</td>
                <td>r31=pc; if(rs&gt;=0) pc+=offset*4</td>
                <td>000001</td>
                <td>rs</td>
                <td>10001</td>
                <td colSpan={3}>offset</td>
              </tr>
              <tr>
                <td>BGTZ rs,offset</td>
                <td>Branch On &gt; 0</td>
                <td>bgtz</td>
                <td>I</td>
                <td>if(rs&gt;0) pc+=offset*4</td>
                <td>000111</td>
                <td>rs</td>
                <td>00000</td>
                <td colSpan={3}>offset</td>
              </tr>
              <tr>
                <td>BLEZ rs,offset</td>
                <td>Branch On</td>
                <td>blez</td>
                <td>I</td>
                <td>if(rs&lt;=0) pc+=offset*4</td>
                <td>000110</td>
                <td>rs</td>
                <td>00000</td>
                <td colSpan={3}>offset</td>
              </tr>
              <tr>
                <td>BLTZ rs,offset</td>
                <td>Branch On &lt; 0</td>
                <td>bltz</td>
                <td>I</td>
                <td>if(rs&lt;0) pc+=offset*4</td>
                <td>000001</td>
                <td>rs</td>
                <td>00000</td>
                <td colSpan={3}>offset</td>
              </tr>
              <tr>
                <td>BLTZAL rs,offset</td>
                <td>Branch On &lt; 0 And Link</td>
                <td>bltzal</td>
                <td>I</td>
                <td>r31=pc; if(rs&lt;0) pc+=offset*4</td>
                <td>000001</td>
                <td>rs</td>
                <td>10000</td>
                <td colSpan={3}>offset</td>
              </tr>
              <tr>
                <td>BNE rs,rt,offset</td>
                <td>Branch On Not Equal</td>
                <td>bne</td>
                <td>I</td>
                <td>if(rs!=rt) pc+=offset*4</td>
                <td>000101</td>
                <td>rs</td>
                <td>rt</td>
                <td colSpan={3}>offset</td>
              </tr>
              <tr>
                <td>BREAK</td>
                <td>Breakpoint</td>
                <td>break</td>
                <td>R</td>
                <td>epc=pc; pc=0x3c</td>
                <td>000000</td>
                <td colSpan={4}>code</td>
                <td>001101</td>
              </tr>
              <tr>
                <td>J target</td>
                <td>Jump</td>
                <td>j</td>
                <td>J</td>
                <td>pc=pc_upper|(target&lt;&lt;2)</td>
                <td>000010</td>
                <td colSpan={5}>target</td>
              </tr>
              <tr>
                <td>JAL target</td>
                <td>Jump And Link</td>
                <td>jal</td>
                <td>J</td>
                <td>r31=pc; pc=target&lt;&lt;2</td>
                <td>000011</td>
                <td colSpan={5}>target</td>
              </tr>
              <tr>
                <td>JALR rs</td>
                <td>Jump And Link Register</td>
                <td>jalr</td>
                <td>R</td>
                <td>rd=pc; pc=rs</td>
                <td>000000</td>
                <td>rs</td>
                <td>00000</td>
                <td>rd</td>
                <td>00000</td>
                <td>001001</td>
              </tr>
              <tr>
                <td>JR rs</td>
                <td>Jump Register</td>
                <td>jr</td>
                <td>R</td>
                <td>pc=rs</td>
                <td>000000</td>
                <td>rs</td>
                <td colSpan={3}>000000000000000</td>
                <td>001000</td>
              </tr>
              <tr>
                <td>MFCO rt,rd</td>
                <td>Move From Coprocessor</td>
                <td>mfco</td>
                <td></td>
                <td>rt=CPR[0,rd]</td>
                <td>010000</td>
                <td>00000</td>
                <td>rt</td>
                <td>rd</td>
                <td colSpan={2}>00000000000</td>
              </tr>
              <tr>
                <td>MTCO rt,rd</td>
                <td>Move To Coprocessor</td>
                <td>mtco</td>
                <td></td>
                <td>CPR[0,rd]=rt</td>
                <td>010000</td>
                <td>00100</td>
                <td>rt</td>
                <td>rd</td>
                <td colSpan={2}>00000000000</td>
              </tr>
              <tr>
                <td>SYSCALL</td>
                <td>System Call</td>
                <td>syscall</td>
                <td></td>
                <td>epc=pc; pc=0x3c</td>
                <td>000000</td>
                <td colSpan={4}>00000000000000000000</td>
                <td>001100</td>
              </tr>

              <tr>
                <td colSpan={11}>
                  <b>Memory Access</b>
                </td>
              </tr>
              <tr>
                <td>LB rt,offset(rs)</td>
                <td>Load Byte</td>
                <td>lb</td>
                <td>I</td>
                <td>rt=*(char*)(offset+rs)</td>
                <td>100000</td>
                <td>rs</td>
                <td>rt</td>
                <td colSpan={3}>offset</td>
              </tr>
              <tr>
                <td>LBU rt,offset(rs)</td>
                <td>Load Byte Unsigned</td>
                <td>lbu</td>
                <td>I</td>
                <td>rt=*(Uchar*)(offset+rs)</td>
                <td>100100</td>
                <td>rs</td>
                <td>rt</td>
                <td colSpan={3}>offset</td>
              </tr>
              <tr>
                <td>LH rt,offset(rs)</td>
                <td>Load Halfword</td>
                <td>lh</td>
                <td>I</td>
                <td>rt=*(short*)(offset+rs)</td>
                <td>100001</td>
                <td>rs</td>
                <td>rt</td>
                <td colSpan={3}>offset</td>
              </tr>
              <tr>
                <td>LHU rt,offset(rs)</td>
                <td>Load Halfword Unsigned</td>
                <td>lhu</td>
                <td>I</td>
                <td>rt=*(Ushort*)(offset+rs)</td>
                <td>100101</td>
                <td>rs</td>
                <td>rt</td>
                <td colSpan={3}>offset</td>
              </tr>
              <tr>
                <td>LW rt,offset(rs)</td>
                <td>Load Word</td>
                <td>lw</td>
                <td>I</td>
                <td>rt=*(int*)(offset+rs)</td>
                <td>100011</td>
                <td>rs</td>
                <td>rt</td>
                <td colSpan={3}>offset</td>
              </tr>
              <tr>
                <td>SB rt,offset(rs)</td>
                <td>Store Byte</td>
                <td>sb</td>
                <td>I</td>
                <td>*(char*)(offset+rs)=rt</td>
                <td>101000</td>
                <td>rs</td>
                <td>rt</td>
                <td colSpan={3}>offset</td>
              </tr>
              <tr>
                <td>SH rt,offset(rs)</td>
                <td>Store Halfword</td>
                <td>sh</td>
                <td>I</td>
                <td>*(short*)(offset+rs)=rt</td>
                <td>101001</td>
                <td>rs</td>
                <td>rt</td>
                <td colSpan={3}>offset</td>
              </tr>
              <tr>
                <td>SW rt,offset(rs)</td>
                <td>Store Word</td>
                <td>sw</td>
                <td>I</td>
                <td>*(int*)(offset+rs)=rt</td>
                <td>101011</td>
                <td>rs</td>
                <td>rt</td>
                <td colSpan={3}>offset</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Opcode;
