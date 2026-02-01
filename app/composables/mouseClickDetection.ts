import { onMounted, onUnmounted, type Component, type TemplateRef } from "vue";

export const useMouseDetection = (
  element: TemplateRef<HTMLElement>,
  onMouseClick?: () => void,
  onMouseMiss?: () => void,
) => {
  let boundingClientRect: DOMRect | undefined;

  const handleMouseUp = (e: MouseEvent) => {
    if (!boundingClientRect)
      throw new Error("Failed to get boundingClientRect for desktop menu.");

    const elementStartPositionX = boundingClientRect.x;
    const elementStartPositionY = boundingClientRect.y;
    const elementEndPositionX =
      elementStartPositionX + boundingClientRect.width;
    const elementEndPositionY =
      elementStartPositionY + boundingClientRect.height;

    if (
      e.clientX < elementEndPositionX &&
      e.clientX > elementStartPositionX &&
      e.clientY < elementEndPositionY &&
      e.clientY > elementStartPositionY
    ) {
      if (onMouseClick) onMouseClick();
    } else {
      if (onMouseMiss) onMouseMiss();
    }
  };
  onMounted(() => {
    boundingClientRect = element.value?.getBoundingClientRect();
    document.addEventListener("mouseup", handleMouseUp);
  });

  onUnmounted(() => {
    document.removeEventListener("mouseup", handleMouseUp);
  });
};
