import { PlayerInfo } from "../util/types";

export class Controls {
  playerPosition: PlayerInfo;
  playerRadius: number;
  isDragging: React.MutableRefObject<boolean>;
  setLineEnd: React.Dispatch<React.SetStateAction<{
    x: number;
    y: number;
}>>;
  setPlayerPosition: React.Dispatch<React.SetStateAction<PlayerInfo>>;
  stageElement = document.querySelector("canvas");

  constructor(playerPosition: PlayerInfo, playerRadius: number, isDragging: React.MutableRefObject<boolean>, setLineEnd: React.Dispatch<React.SetStateAction<{
    x: number;
    y: number;
}>>, setPlayerPosition: React.Dispatch<React.SetStateAction<PlayerInfo>>) {
    this.playerPosition = playerPosition;
    this.playerRadius = playerRadius;
    this.isDragging = isDragging;
    this.setLineEnd = setLineEnd;
    this.setPlayerPosition = setPlayerPosition;
  }

  handleMouseDown = (): void => {
    this.isDragging.current = true;


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

      const innerProduct = Math.sqrt(dx*dx + dy*dy);

      let multiplier = -1;

      if (innerProduct > this.playerRadius) {
        multiplier *= this.playerRadius / innerProduct;
      }

      this.setPlayerPosition((prev) => ({
        ...prev,
        dx: multiplier * dx,
        dy: multiplier * dy,
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
      const innerProduct = Math.sqrt(dx*dx + dy*dy);

      let multiplier = 1;

      if (innerProduct > 5*this.playerRadius) {
        multiplier = 5*(this.playerRadius / innerProduct);
      }

      this.setLineEnd({
        x: this.playerPosition.x + multiplier*(this.playerPosition.x - mouseX),
        y: this.playerPosition.y + multiplier*(this.playerPosition.y - mouseY),
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
  }
}