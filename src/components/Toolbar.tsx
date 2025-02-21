import '../styles/Toolbar.css';
import { Algorithm } from '../types/algorithms';

interface ToolbarProps {
  onAlgorithmSelect: (algorithm: Algorithm) => void;
  hasImage: boolean;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Toolbar = ({ onAlgorithmSelect, hasImage, onFileSelect }: ToolbarProps) => {
  return (
    <div className="toolbar">
      {!hasImage ? (
        <label className="toolbar-button" title="Upload an image to start processing">
          <input type="file" accept="image/*" onChange={onFileSelect} style={{ display: 'none' }} />
          +
        </label>
      ) : (
        <>
          <button
            type="button"
            className="toolbar-button"
            onClick={() => onAlgorithmSelect(Algorithm.FLOYD_STEINBERG)}
            title="Floyd-Steinberg Dithering: Reduces the color palette while maintaining image detail through error diffusion"
          >
            FS
          </button>
          <button
            type="button"
            className="toolbar-button"
            onClick={() => onAlgorithmSelect(Algorithm.GRAYSCALE)}
            title="Grayscale: Converts the image to black and white using luminance values"
          >
            GS
          </button>
          <button
            type="button"
            className="toolbar-button"
            onClick={() => onAlgorithmSelect(Algorithm.REVERSE)}
            title="Reverse Colors: Inverts all colors in the image to their opposite values"
          >
            RV
          </button>
          <button
            type="button"
            className="toolbar-button"
            onClick={() => onAlgorithmSelect(Algorithm.RESTORE)}
            title="Restore: Return to original image"
          >
            OR
          </button>
          <label className="toolbar-button" title="Change Image: Upload a new image to process">
            <input
              type="file"
              accept="image/*"
              onChange={onFileSelect}
              style={{ display: 'none' }}
            />
            ↻
          </label>
        </>
      )}
    </div>
  );
};

export default Toolbar;
