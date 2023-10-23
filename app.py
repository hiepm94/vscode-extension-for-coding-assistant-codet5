from flask import Flask, request, jsonify
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer, AutoModel
from transformers import RobertaTokenizer, T5ForConditionalGeneration

import torch
app = Flask(__name__)
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
models = {
    'summarizeModel': {
        # 'model': AutoModel.from_pretrained('codet5p-220m-bimodal',
        #                                     trust_remote_code=True).to(device),
        # 'tokenizer': AutoTokenizer.from_pretrained('codet5p-220m-bimodal',
        #                                             trust_remote_code=True)
        'model': T5ForConditionalGeneration.from_pretrained('E:/CodeT5/finetuned_summarize_python_codet5_base').to(device),
        'tokenizer': RobertaTokenizer.from_pretrained('E:/CodeT5/codet5-base')
    },
    'autocompleteModel': {
        # 'model': AutoModelForSeq2SeqLM.from_pretrained('codet5p-2b',
        #                                             torch_dtype=torch.float16,
        #                                             trust_remote_code=True).to(device),
        # 'tokenizer': AutoTokenizer.from_pretrained('codet5p-2b')
        'model': T5ForConditionalGeneration.from_pretrained('E:/CodeT5/codet5-base').to(device),
        'tokenizer': RobertaTokenizer.from_pretrained('E:/CodeT5/codet5-base')
    },
    'autocompleteModelPython': {
        # 'model': AutoModelForSeq2SeqLM.from_pretrained('codet5p-770m-py',
        #                                             trust_remote_code=True.to(device)),
        # 'tokenizer': AutoTokenizer.from_pretrained('codet5p-770m-py')
        'model': T5ForConditionalGeneration.from_pretrained('E:/CodeT5/codet5-base').to(device),
        'tokenizer': RobertaTokenizer.from_pretrained('E:/CodeT5/codet5-base')
    },
}

@app.route('/api/summarizeModel', methods=['POST'])
def summarizeModel_api():
    return run_model('summarizeModel', max_length = 32)

@app.route('/api/autocompleteModel', methods=['POST'])
def autocompleteModel_api():
    return run_model('autocompleteModel', max_length = 750)

@app.route('/api/autocompleteModelPython', methods=['POST'])
def autocompleteModelPython_api():
    return run_model('autocompleteModelPython', max_length = 750)

def run_model(model_name, max_length):
    data = request.json
    input_text = data['text']

    input_ids = models[model_name]['tokenizer'].encode(input_text, return_tensors='pt').to(device)
    output = models[model_name]['model'].generate(input_ids, max_length = max_length)
    decoded_output = models[model_name]['tokenizer'].decode(output[0], skip_special_tokens=True)
    
    return jsonify({'result': decoded_output})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)