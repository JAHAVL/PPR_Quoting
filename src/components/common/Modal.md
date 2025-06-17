# Modal Component Documentation

The Modal component is a reusable UI element that provides a consistent way to display modal dialogs throughout the application. It's designed to be accessible, customizable, and easy to use.

## Features

- Accessible design with proper ARIA attributes
- Keyboard support (ESC to close)
- Click outside to dismiss
- Customizable size
- Optional footer for action buttons
- Smooth animations
- Backdrop overlay

## Usage

```tsx
import Modal from '../components/common/Modal';

const MyComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="My Modal Title"
        size="medium"
      >
        <p>Modal content goes here...</p>
      </Modal>
    </>
  );
};
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `isOpen` | boolean | Yes | - | Controls whether the modal is displayed |
| `onClose` | function | Yes | - | Function called when the modal should close |
| `title` | string | Yes | - | Title displayed in the modal header |
| `children` | ReactNode | Yes | - | Content to be displayed in the modal body |
| `footer` | ReactNode | No | null | Optional footer content (typically action buttons) |
| `size` | 'small' \| 'medium' \| 'large' \| 'full' | No | 'medium' | Controls the width of the modal |
| `closeOnEsc` | boolean | No | true | Whether pressing ESC should close the modal |
| `closeOnOutsideClick` | boolean | No | true | Whether clicking outside the modal should close it |

## Creating Form Modals

For form modals, you can combine the Modal component with a form and use the `footer` prop to add action buttons:

```tsx
import Modal from '../components/common/Modal';
import styles from './FormModals.module.css';

const AddItemModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({ name: '' });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };
  
  const modalFooter = (
    <>
      <button 
        type="button" 
        className={styles.cancelButton}
        onClick={onClose}
      >
        Cancel
      </button>
      <button 
        type="submit" 
        className={styles.submitButton}
        onClick={handleSubmit}
      >
        Add Item
      </button>
    </>
  );
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Item"
      footer={modalFooter}
    >
      <form className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
      </form>
    </Modal>
  );
};
```

## Styling

The Modal component uses CSS modules for styling. You can customize the appearance by modifying the `Modal.module.css` file.

## Accessibility

The Modal component follows accessibility best practices:
- Uses proper ARIA roles and attributes
- Traps focus within the modal when open
- Supports keyboard navigation
- Provides proper labeling

## Examples

See the following components for examples of how to use the Modal:
- `AddClientModal` - A form modal for adding new clients
- `AddEmployeeModal` - A form modal for adding new employees
