import React from 'react';
import { NextPage } from 'next';
import Tools from '../components/editor/Tools';
import Workspace from '../components/editor/Workspace';

type EditorProps = {};

const Editor: NextPage<EditorProps> = () => (
  <div className="Editor">
    <aside className="tools-wrapper">
      <Tools>
      </Tools>
    </aside>

    <section className="circuitry-design">
      <Workspace>
      </Workspace>
    </section>

    <style jsx>{`
      div.Editor {
        font-size: 0;
        height: 100vh;
        width: 100vw;
        overflow: hidden;
      }

      div.Editor > aside.tools-wrapper {
        width: 30vw;
        height: 100vh;
        background-color: #222;
        color: white;
        display: inline-block;
        vertical-align: top;
      }

      div.Editor > section.circuitry-design {
        width: 70vw;
        height: 100vh;
        display: inline-block;
        vertical-align: top;
      }
    `}</style>
  </div>
);

export default Editor;
