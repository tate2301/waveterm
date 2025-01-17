import React from "react";
import { StatusIndicatorLevel } from "../../../types/types";
import cn from "classnames";
import { ReactComponent as SpinnerIndicator } from "../../assets/icons/spinner-indicator.svg";
import { boundMethod } from "autobind-decorator";

interface PositionalIconProps {
    children?: React.ReactNode;
    className?: string;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    divRef?: React.RefObject<HTMLDivElement>;
}

export class FrontIcon extends React.Component<PositionalIconProps> {
    render() {
        return (
            <div ref={this.props.divRef} className={cn("front-icon", "positional-icon", this.props.className)}>
                <div className="positional-icon-inner">{this.props.children}</div>
            </div>
        );
    }
}

export class CenteredIcon extends React.Component<PositionalIconProps> {
    render() {
        return (
            <div
                ref={this.props.divRef}
                className={cn("centered-icon", "positional-icon", this.props.className)}
                onClick={this.props.onClick}
            >
                <div className="positional-icon-inner">{this.props.children}</div>
            </div>
        );
    }
}

interface ActionsIconProps {
    onClick: React.MouseEventHandler<HTMLDivElement>;
}

export class ActionsIcon extends React.Component<ActionsIconProps> {
    render() {
        return (
            <CenteredIcon className="actions" onClick={this.props.onClick}>
                <div className="icon hoverEffect fa-sharp fa-solid fa-1x fa-ellipsis-vertical"></div>
            </CenteredIcon>
        );
    }
}

interface StatusIndicatorProps {
    level: StatusIndicatorLevel;
    className?: string;
    runningCommands?: boolean;
}

export class StatusIndicator extends React.Component<StatusIndicatorProps> {
    iconRef: React.RefObject<HTMLDivElement> = React.createRef();
    listenerAdded: boolean = false;

    componentDidMount() {
        this.syncSpinner();
    }

    componentDidUpdate() {
        this.syncSpinner();
    }

    componentWillUnmount(): void {
        if (this.iconRef.current != null && this.listenerAdded) {
            const elem = this.iconRef.current;
            const svgElem = elem.querySelector("svg");
            if (svgElem != null) {
                svgElem.removeEventListener("animationstart", this.handleAnimationStart);
            }
        }
    }

    @boundMethod
    handleAnimationStart(e: AnimationEvent) {
        if (this.iconRef.current == null) {
            return;
        }
        const svgElem = this.iconRef.current.querySelector("svg");
        if (svgElem == null) {
            return;
        }
        const animArr = svgElem.getAnimations();
        if (animArr == null || animArr.length == 0) {
            return;
        }
        animArr[0].startTime = 0;
    }

    syncSpinner() {
        if (!this.props.runningCommands) {
            return;
        }
        if (this.iconRef.current == null) {
            return;
        }
        const elem = this.iconRef.current;
        const svgElem = elem.querySelector("svg");
        if (svgElem == null) {
            return;
        }
        if (!this.listenerAdded) {
            svgElem.addEventListener("animationstart", this.handleAnimationStart);
            this.listenerAdded = true;
        }
        const animArr = svgElem.getAnimations();
        if (animArr == null || animArr.length == 0) {
            return;
        }
        animArr[0].startTime = 0;
    }

    render() {
        const { level, className, runningCommands } = this.props;
        let statusIndicator = null;
        if (level != StatusIndicatorLevel.None || runningCommands) {
            let levelClass = null;
            switch (level) {
                case StatusIndicatorLevel.Output:
                    levelClass = "output";
                    break;
                case StatusIndicatorLevel.Success:
                    levelClass = "success";
                    break;
                case StatusIndicatorLevel.Error:
                    levelClass = "error";
                    break;
            }
            statusIndicator = (
                <CenteredIcon divRef={this.iconRef} className={cn(className, levelClass, "status-indicator")}>
                    <SpinnerIndicator className={runningCommands ? "spin" : null} />
                </CenteredIcon>
            );
        }
        return statusIndicator;
    }
}
