import { PlayerInfo, Coordinates2D } from "../util/types";

export class Controls {
  playerPosition: PlayerInfo;
  playerRadius: number;
  isDragging: React.MutableRefObject<boolean>;
  setLineEnd: React.Dispatch<
    React.SetStateAction<{
      x: number;
      y: number;
    }>
  >;
  initialMousePos: React.MutableRefObject<Coordinates2D>;
  setPlayerPosition: React.Dispatch<React.SetStateAction<PlayerInfo>>;
  stageElement = document.querySelector("canvas");

  constructor(
    playerPosition: PlayerInfo,
    playerRadius: number,
    isDragging: React.MutableRefObject<boolean>,
    setLineEnd: React.Dispatch<
      React.SetStateAction<{
        x: number;
        y: number;
      }>
    >,
    setPlayerPosition: React.Dispatch<React.SetStateAction<PlayerInfo>>,
    initialMousePos: React.MutableRefObject<Coordinates2D>
  ) {
    this.playerPosition = playerPosition;
    this.playerRadius = playerRadius;
    this.isDragging = isDragging;
    this.setLineEnd = setLineEnd;
    this.setPlayerPosition = setPlayerPosition;
    this.initialMousePos = initialMousePos;
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

  handleMouseUp = (event: MouseEvent): void => {
    if (this.isDragging.current) {
      const stageElement = document.querySelector("canvas");
      const boundingRect = stageElement?.getBoundingClientRect();
      const mouseX = event.clientX - (boundingRect?.left ?? 0);
      const mouseY = event.clientY - (boundingRect?.top ?? 0);

      const dx = mouseX - this.playerPosition.x;
      const dy = mouseY - this.playerPosition.y;

      const innerProduct = Math.sqrt(dx * dx + dy * dy);

      let multiplier = -0.005;

      if (innerProduct > this.playerRadius) {
        multiplier *= this.playerRadius / innerProduct;
      }

      this.setPlayerPosition((prev) => ({
        ...prev,
        dx: multiplier * dx * Math.abs(dx),
        dy: multiplier * dy * Math.abs(dy),
      }));
      this.isDragging.current = false;
    }
  };

  handleMouseMove = (event: MouseEvent): void => {
    if (this.isDragging.current) {
      const stageElement = document.querySelector("canvas");
      const boundingRect = stageElement?.getBoundingClientRect();
      const mouseX = event.clientX - (boundingRect?.left ?? 0);
      const mouseY = event.clientY - (boundingRect?.top ?? 0);

      const dx = this.playerPosition.x - mouseX;
      const dy = this.playerPosition.y - mouseY;
      const innerProduct = Math.sqrt(dx * dx + dy * dy);

      let multiplier = 1;

      if (innerProduct > 5 * this.playerRadius) {
        multiplier = 5 * (this.playerRadius / innerProduct);
      }

      this.setLineEnd({
        x:
          this.playerPosition.x + multiplier * (this.playerPosition.x - mouseX),
        y:
          this.playerPosition.y + multiplier * (this.playerPosition.y - mouseY),
      });
    }
  };

  addListeners = (): void => {
    window.addEventListener("mousemove", this.handleMouseMove);
    this.stageElement?.addEventListener("mousedown", this.handleMouseDown);
    window.addEventListener("mouseup", this.handleMouseUp);
  };

  removeListeners = (): void => {
    this.stageElement?.removeEventListener("mousedown", this.handleMouseDown);
    window.removeEventListener("mouseup", this.handleMouseUp);
    window.removeEventListener("mousemove", this.handleMouseMove);
  };
}
