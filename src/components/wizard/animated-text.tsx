/**
 * @file Animated text component that cycles through text messages with smooth transitions.
 */

interface AnimatedTextProps {
  texts: string[];
  currentIndex: number;
}

export const AnimatedText = ({ texts, currentIndex }: AnimatedTextProps) => (
  <>
    <div className="text-carousel text-xs text-muted-foreground">
      {texts.map((text, index) => (
        <div
          key={text}
          className={`text-carousel-item ${
            index === currentIndex ? "active" : ""
          }`}
        >
          {text}
        </div>
      ))}
    </div>
  </>
);
