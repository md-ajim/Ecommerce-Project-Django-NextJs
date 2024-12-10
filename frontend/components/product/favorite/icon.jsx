import {Button} from "@nextui-org/react";
import {HeartIcon} from './heartIcon';


export default function Like() {
  return (
    <div className="flex gap-4 items-center">
      <Button isIconOnly color="danger" aria-label="Like">
        <HeartIcon />
      </Button>    
    </div>
  );
}