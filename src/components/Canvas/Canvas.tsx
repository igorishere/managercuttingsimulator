import { useEffect, useRef, useState } from "react";
import ICanvasProps from "./ICanvasProps";
import IPosition from "../../common/IPosition";
import "./Canvas.css"
import Rect from "./Rect";

export default function Canvas(props: ICanvasProps) {

    const MAX_ZOOM = 5
    const MIN_ZOOM = 0.1
    const SCROLL_SENSITIVITY = 0.0005

    let objects = props.elements;

    const [isDraging, setIsDraging] = useState(false);
    const [dragStart, setDragStart] = useState<IPosition>({ X: 0, Y: 0 });
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [cameraOffset, setCameraOffset] = useState<IPosition>({ X: 0, Y: 0 });
    const [cameraZoom, setCameraZoom] = useState(1);

    const canvasReference = useRef<HTMLCanvasElement>(null);
    const canvasWrapperReference = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setWidth(canvasWrapperReference.current?.clientWidth ?? 0);
        setHeight(canvasWrapperReference.current?.clientHeight ?? 0);
    }, []);

    useEffect(() => {
        setCameraOffset({
            X: width / 2,
            Y: height / 2
        });

    }, [width, height])

    function Render(): void {

        let canvas = canvasReference.current;
        if (canvas === null) return;

        canvas.width = width;
        canvas.height = height;

        let context = canvas?.getContext("2d") ?? null;

        if (context === null) {
            console.log('context is null')
            return;
        }

        context.translate(width / 2, height / 2)
        context.scale(cameraZoom, cameraZoom)
        context.translate(-width / 2 + cameraOffset.X, -height / 2 + cameraOffset.Y)

        var elementsToDraw = objects ?? [];

        if (elementsToDraw.length > 0) {
            elementsToDraw.map(obj => {

                try {
                    DrawRect(obj);
                } catch (error) {
                    console.log('erro ao desenhar elemento...');
                    console.log(error);
                }

            });
        }

        requestAnimationFrame(Render)
    }

    Render();

    function DrawRect(rect: Rect) {
        let canvas = canvasReference.current;
        if (canvas === null) {
            return;
        }

        let context = canvas?.getContext("2d") ?? null;

        if (context === null) {
            return;
        }
        context.fillStyle = rect.backgroundColor;
        context.fillRect(rect.x, rect.y, rect.width, rect.height);

        if (rect.lineOptions !== null) {
            context.lineWidth = rect.lineOptions.thickness;
            context.strokeStyle = rect.lineOptions.color;

            context.beginPath();
            context.rect(rect.x, rect.y, rect.width, rect.height);
            context.stroke();
        }

    }

    function HandleMouseEnter(event: React.MouseEvent) {
        setIsDraging(true);
        var dsx = event.clientX / cameraZoom - cameraOffset.X;
        var dsy = event.clientY / cameraZoom - cameraOffset.Y;
        setDragStart({ X: dsx, Y: dsy });
    }

    function HandleMouseLeave() {
        setIsDraging(false);
    }

    function HandleMouseMove(event: React.MouseEvent) {
        if (isDraging) {
            var x = event.clientX;
            var y = event.clientY;
            let currentCameraOffsetX = x / cameraZoom - dragStart.X;
            let currentCameraOffsetY = y / cameraZoom - dragStart.Y;

            setCameraOffset({
                X: currentCameraOffsetX,
                Y: currentCameraOffsetY
            })
        }
    }

    function UpdateZoom(zoomAmount: number): void {
        if (isDraging) return;

        var currentCameraZoom = cameraZoom;
        currentCameraZoom += zoomAmount;

        if (currentCameraZoom >= MAX_ZOOM || currentCameraZoom <= MIN_ZOOM) return;

        setCameraZoom(currentCameraZoom);
    }

    function Center(): void {
        setCameraOffset({
            X: width / 2,
            Y: height / 2
        });
    }

    function ResetZoom(): void {
        setCameraZoom(1);
    }

    function FullReset(): void {
        Center();
        ResetZoom();
    }

    return (
        <div
            id='canvasWrapper'
            ref={canvasWrapperReference}
        >
            <canvas
                id='canvinhas'
                ref={canvasReference}
                onMouseDown={(e) => HandleMouseEnter(e)}
                onMouseUp={() => HandleMouseLeave()}
                onMouseMove={(e) => HandleMouseMove(e)}
                onWheel={(e) => UpdateZoom(-e.deltaY * SCROLL_SENSITIVITY)}
            />
            <span id='zoomButtonsWrapper'>
                <button onClick={() => UpdateZoom(0.5)}>+</button>
                <button onClick={() => UpdateZoom(-0.5)}>-</button>
                <button onClick={() => FullReset()}>reset</button>
            </span>
        </div>
    )
}