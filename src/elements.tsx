import * as React from "react";
import * as mobxReact from "mobx-react";
import * as mobx from "mobx";
import {sprintf} from "sprintf-js";
import {boundMethod} from "autobind-decorator";
import cn from "classnames";
import {If, For, When, Otherwise, Choose} from "tsx-control-statements/components";

class CmdStrCode extends React.Component<{cmdstr : string, onUse : () => void, onCopy : () => void, isCopied : boolean}, {}> {
    @boundMethod
    handleUse() {
        if (this.props.onUse != null) {
            this.props.onUse()
        }
    }

    @boundMethod
    handleCopy() {
        if (this.props.onCopy != null) {
            this.props.onCopy();
        }
    }

    render() {
        let {isCopied, cmdstr} = this.props;
        return (
            <div className={cn("cmdstr-code")}>
                <If condition={isCopied}>
                    <div key="copied" className="copied-indicator">
                        <div>copied</div>
                    </div>
                </If>
                <div key="use" className="use-button" title="Use Command" onClick={this.handleUse}><i className="fa-sharp fa-solid fa-check"/></div>
                <div key="code" className="code-div">
                    <code>{cmdstr}</code>
                </div>
                <div key="copy" className="copy-control">
                    <div className="inner-copy" onClick={this.handleCopy}>
                        <i title="copy" className="fa-sharp fa-regular fa-copy"/>
                    </div>
                </div>
            </div>
        );
    }
}

export {CmdStrCode};
