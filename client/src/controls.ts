import { Coordinates2D, PlayerInfo } from "./types";

export class Controls {
  playerPosition: PlayerInfo;
  playerRadius: number;
  isDragging: React.MutableRefObject<boolean>;
  initialMousePos: React.MutableRefObject<Coordinates2D>;
  setLineEnd: React.Dispatch<React.SetStateAction<{
    x: number;
    y: number;
}>>;
  setPlayerPosition: React.Dispatch<React.SetStateAction<PlayerInfo>>;
  stageElement = document.querySelector("canvas");

  constructor(playerPosition: PlayerInfo, playerRadius: number, isDragging: React.MutableRefObject<boolean>, initialMousePos: React.MutableRefObject<Coordinates2D>, setLineEnd: React.Dispatch<React.SetStateAction<{
    x: number;
    y: number;
}>>, setPlayerPosition: React.Dispatch<React.SetStateAction<PlayerInfo>>) {
    this.playerPosition = playerPosition;
    this.playerRadius = playerRadius;
    this.isDragging = isDragging;
    this.initialMousePos = initialMousePos;
    this.setLineEnd = setLineEnd;
    this.setPlayerPosition = setPlayerPosition;
  }

  handleMouseDown = (event: MouseEvent) => {
    const stageElement = event.currentTarget as HTMLElement;
    const boundingRect = stageElement.getBoundingClientRect();
    const mouseX = event.clientX - boundingRect.left;
    const mouseY = event.clientY - boundingRect.top;
    const dx = mouseX - this.playerPosition.x;
    const dy = mouseY - this.playerPosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.playerRadius) {
      this.isDragging.current = true;
      this.initialMousePos.current = { x: mouseX, y: mouseY };
    }

    this.setLineEnd({ x: this.playerPosition.x, y: this.playerPosition.y });
  };

  handleMouseUp = (event: MouseEvent) => {
    if (this.isDragging.current) {
      const stageElement = document.querySelector("canvas");
      const boundingRect = stageElement?.getBoundingClientRect();
      const mouseX = event.clientX - (boundingRect?.left ?? 0);
      const mouseY = event.clientY - (boundingRect?.top ?? 0);

      const dx = mouseX - this.initialMousePos.current.x;
      const dy = mouseY - this.initialMousePos.current.y;

      this.setPlayerPosition((prev) => ({
        ...prev,
        dx: dx * -0.7,
        dy: dy * -0.7,
      }));
      this.isDragging.current = false;
    }
  };

  handleMouseMove = (event: MouseEvent) => {
    if (this.isDragging.current) {
      const stageElement = document.querySelector("canvas");
      const boundingRect = stageElement?.getBoundingClientRect();
      const mouseX = event.clientX - (boundingRect?.left ?? 0);
      const mouseY = event.clientY - (boundingRect?.top ?? 0);
      this.setLineEnd({
        x: this.playerPosition.x + (this.playerPosition.x - mouseX),
        y: this.playerPosition.y + (this.playerPosition.y - mouseY),
      });
    }
  };

  addListeners = () => {
    window.addEventListener("mousemove", this.handleMouseMove);
    this.stageElement?.addEventListener("mousedown", this.handleMouseDown);
    window.addEventListener("mouseup", this.handleMouseUp);
  };

  removeListeners = () => {
    this.stageElement?.removeEventListener("mousedown", this.handleMouseDown);
    window.removeEventListener("mouseup", this.handleMouseUp);
    window.removeEventListener("mousemove", this.handleMouseMove);
  }




}